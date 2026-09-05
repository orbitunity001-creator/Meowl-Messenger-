const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

const JWT_SECRET =
  process.env.JWT_SECRET || "MEOWI_CHANGE_THIS_SECRET_123456789";


// ============================================================
// CORS
// ============================================================

app.use(
  cors({
    origin: "*"
  })
);

app.use(express.json());


// ============================================================
// SOCKET.IO
// ============================================================

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


// ============================================================
// DATABASE
// ============================================================

const db = new Database("meowi.db");

db.pragma("journal_mode = WAL");


db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS messages_sender_idx
  ON messages(sender_id);

  CREATE INDEX IF NOT EXISTS messages_receiver_idx
  ON messages(receiver_id);
`);


// ============================================================
// PREPARED STATEMENTS
// ============================================================

const createUser = db.prepare(`
  INSERT INTO users
  (name, username, email, password)
  VALUES (?, ?, ?, ?)
`);

const findUserByEmail = db.prepare(`
  SELECT *
  FROM users
  WHERE email = ?
`);

const findUserByUsername = db.prepare(`
  SELECT *
  FROM users
  WHERE username = ?
`);

const findUserById = db.prepare(`
  SELECT
    id,
    name,
    username,
    email,
    created_at
  FROM users
  WHERE id = ?
`);

const searchUsers = db.prepare(`
  SELECT
    id,
    name,
    username,
    created_at
  FROM users
  WHERE id != ?
    AND (
      LOWER(name) LIKE ?
      OR LOWER(username) LIKE ?
    )
  ORDER BY name ASC
  LIMIT 50
`);

const getMessages = db.prepare(`
  SELECT
    id,
    sender_id,
    receiver_id,
    body,
    created_at
  FROM messages
  WHERE
    (
      sender_id = ?
      AND receiver_id = ?
    )
    OR
    (
      sender_id = ?
      AND receiver_id = ?
    )
  ORDER BY id ASC
  LIMIT 500
`);

const createMessage = db.prepare(`
  INSERT INTO messages
  (sender_id, receiver_id, body)
  VALUES (?, ?, ?)
`);


// ============================================================
// HELPERS
// ============================================================

function cleanUsername(username) {
  return String(username || "")
    .trim()
    .replace(/^@+/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
}


function publicUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    created_at: user.created_at
  };
}


function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    JWT_SECRET,
    {
      expiresIn: "30d"
    }
  );
}


function authMiddleware(req, res, next) {

  const header =
    req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {

    return res.status(401).json({
      error: "Необходим вход в аккаунт."
    });
  }

  const token =
    header.substring(7);

  try {

    const decoded =
      jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      error: "Сессия истекла. Войдите снова."
    });
  }
}


// ============================================================
// TEST SERVER
// ============================================================

app.get("/", (req, res) => {

  res.json({
    ok: true,
    name: "MeowI Messenger",
    message: "Сервер работает!"
  });

});


// ============================================================
// REGISTER
// ============================================================

app.post("/api/register", async (req, res) => {

  try {

    const name =
      String(req.body.name || "").trim();

    const email =
      String(req.body.email || "")
        .trim()
        .toLowerCase();

    const password =
      String(req.body.password || "");

    const username =
      cleanUsername(req.body.username);


    if (name.length < 2) {

      return res.status(400).json({
        error: "Имя должно содержать минимум 2 символа."
      });
    }


    if (username.length < 3) {

      return res.status(400).json({
        error: "Username должен содержать минимум 3 символа."
      });
    }


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

      return res.status(400).json({
        error: "Введите правильный email."
      });
    }


    if (password.length < 6) {

      return res.status(400).json({
        error: "Пароль должен содержать минимум 6 символов."
      });
    }


    const existingEmail =
      findUserByEmail.get(email);

    if (existingEmail) {

      return res.status(400).json({
        error: "Этот email уже зарегистрирован."
      });
    }


    const existingUsername =
      findUserByUsername.get(username);

    if (existingUsername) {

      return res.status(400).json({
        error: "Этот username уже занят."
      });
    }


    const passwordHash =
      await bcrypt.hash(password, 12);


    const result =
      createUser.run(
        name,
        username,
        email,
        passwordHash
      );


    const user =
      findUserById.get(result.lastInsertRowid);


    const token =
      createToken(user);


    return res.json({

      success: true,

      token,

      user: publicUser(user)

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Ошибка регистрации."
    });

  }

});


// ============================================================
// LOGIN
// ============================================================

app.post("/api/login", async (req, res) => {

  try {

    const email =
      String(req.body.email || "")
        .trim()
        .toLowerCase();

    const password =
      String(req.body.password || "");


    const user =
      findUserByEmail.get(email);


    if (!user) {

      return res.status(401).json({
        error: "Неверный email или пароль."
      });
    }


    const valid =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!valid) {

      return res.status(401).json({
        error: "Неверный email или пароль."
      });
    }


    const token =
      createToken(user);


    return res.json({

      success: true,

      token,

      user: publicUser(user)

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Ошибка входа."
    });

  }

});


// ============================================================
// CURRENT USER
// ============================================================

app.get(
  "/api/me",
  authMiddleware,
  (req, res) => {

    const user =
      findUserById.get(req.user.id);


    if (!user) {

      return res.status(404).json({
        error: "Пользователь не найден."
      });
    }


    res.json({
      user: publicUser(user)
    });

  }
);


// ============================================================
// SEARCH USERS
// ============================================================

app.get(
  "/api/users",
  authMiddleware,
  (req, res) => {

    const q =
      String(req.query.q || "")
        .trim()
        .toLowerCase();


    const search =
      `%${q}%`;


    const users =
      searchUsers.all(
        req.user.id,
        search,
        search
      );


    res.json({
      users
    });

  }
);


// ============================================================
// GET CHAT MESSAGES
// ============================================================

app.get(
  "/api/messages/:friendId",
  authMiddleware,
  (req, res) => {

    const friendId =
      Number(req.params.friendId);


    if (!Number.isInteger(friendId)) {

      return res.status(400).json({
        error: "Неверный пользователь."
      });
    }


    const messages =
      getMessages.all(
        req.user.id,
        friendId,
        friendId,
        req.user.id
      );


    res.json({
      messages
    });

  }
);


// ============================================================
// SEND MESSAGE
// ============================================================

app.post(
  "/api/messages",
  authMiddleware,
  (req, res) => {

    try {

      const receiverId =
        Number(req.body.receiverId);

      const body =
        String(req.body.body || "").trim();


      if (!Number.isInteger(receiverId)) {

        return res.status(400).json({
          error: "Неверный получатель."
        });
      }


      if (!body) {

        return res.status(400).json({
          error: "Сообщение пустое."
        });
      }


      if (body.length > 4000) {

        return res.status(400).json({
          error: "Сообщение слишком длинное."
        });
      }


      const receiver =
        findUserById.get(receiverId);


      if (!receiver) {

        return res.status(404).json({
          error: "Получатель не найден."
        });
      }


      const result =
        createMessage.run(
          req.user.id,
          receiverId,
          body
        );


      const message = {

        id: result.lastInsertRowid,

        sender_id: req.user.id,

        receiver_id: receiverId,

        body,

        created_at:
          new Date().toISOString()

      };


      // Отправляем получателю в realtime

      io.to(
        `user_${receiverId}`
      ).emit(
        "new_message",
        message
      );


      // Отправляем отправителю

      io.to(
        `user_${req.user.id}`
      ).emit(
        "new_message",
        message
      );


      res.json({
        success: true,
        message
      });


    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: "Не удалось отправить сообщение."
      });

    }

  }
);


// ============================================================
// SOCKET AUTH
// ============================================================

io.use((socket, next) => {

  try {

    const token =
      socket.handshake.auth?.token;


    if (!token) {

      return next(
        new Error("Нет токена")
      );
    }


    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );


    socket.userId =
      decoded.id;


    next();


  } catch (error) {

    next(
      new Error("Недействительный токен")
    );

  }

});


// ============================================================
// SOCKET CONNECTION
// ============================================================

io.on(
  "connection",
  (socket) => {

    console.log(
      "Пользователь подключился:",
      socket.userId
    );


    socket.join(
      `user_${socket.userId}`
    );


    socket.on(
      "disconnect",
      () => {

        console.log(
          "Пользователь отключился:",
          socket.userId
        );

      }
    );

  }
);


// ============================================================
// START
// ============================================================

server.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `MeowI Messenger server запущен на порту ${PORT}`
    );

  }
);