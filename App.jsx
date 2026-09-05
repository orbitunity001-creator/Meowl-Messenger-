import { useEffect, useRef, useState } from "react";
import "./index.css";

const USERS_KEY = "sb_publishable_5-1jR2q3JRmXTAjksWFndA_yraWCUD2";
const CURRENT_KEY = "https://ehkdidgjiszpqqajsxsu.supabase.co";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function getCurrent() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_KEY));
  } catch {
    return null;
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveCurrent(user) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
}

function Avatar({ user, big = false }) {
  const letter =
    user?.displayName?.[0]?.toUpperCase() ||
    user?.username?.[0]?.toUpperCase() ||
    "?";

  return (
    <div className={`avatar ${big ? "avatar-big" : ""}`}>
      {user?.avatar ? (
        <img src={user.avatar} alt="avatar" />
      ) : (
        letter
      )}
    </div>
  );
}

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(true);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");

    const users = getUsers();

    if (isRegister) {
      if (username.trim().length < 3) {
        setError("Ник должен быть минимум 3 символа.");
        return;
      }

      if (name.trim().length < 2) {
        setError("Введите имя.");
        return;
      }

      if (password.length < 6) {
        setError("Пароль должен быть минимум 6 символов.");
        return;
      }

      if (
        users.some(
          (u) =>
            u.email === email.trim().toLowerCase()
        )
      ) {
        setError("Этот email уже используется.");
        return;
      }

      if (
        users.some(
          (u) =>
            u.username.toLowerCase() ===
            username.trim().toLowerCase()
        )
      ) {
        setError("Этот ник уже занят.");
        return;
      }

      const user = {
        id:
          crypto.randomUUID?.() ||
          Date.now().toString(),

        username: username.trim(),
        displayName: name.trim(),
        email: email.trim().toLowerCase(),
        password,

        bio: "",
        avatar: "",
      };

      saveUsers([...users, user]);
      saveCurrent(user);

      onLogin(user);
      return;
    }

    const user = users.find(
      (u) =>
        u.email === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!user) {
      setError("Неверный email или пароль.");
      return;
    }

    saveCurrent(user);
    onLogin(user);
  }

  return (
    <div className="auth-screen">

      <div className="glow glow-left" />
      <div className="glow glow-right" />

      <div className="auth-box">

        <div className="logo">
          <div className="logo-square">
            M
          </div>

          <span>Messenger</span>
        </div>

        <div className="auth-title">

          <h1>
            {isRegister
              ? "Создай аккаунт"
              : "С возвращением"}
          </h1>

          <p>
            {isRegister
              ? "Добро пожаловать в Messenger"
              : "Войди в свой аккаунт"}
          </p>

        </div>

        <form onSubmit={submit}>

          {isRegister && (
            <>
              <label>
                Ник

                <input
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="alex"
                  required
                />
              </label>

              <label>
                Имя

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Алекс"
                  required
                />
              </label>
            </>
          )}

          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Пароль

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
              required
            />
          </label>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button className="main-button">
            {isRegister
              ? "Создать аккаунт"
              : "Войти"}
          </button>

        </form>

        <div className="switch">

          <span>
            {isRegister
              ? "Уже есть аккаунт?"
              : "Нет аккаунта?"}
          </span>

          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister
              ? "Войти"
              : "Регистрация"}
          </button>

        </div>

      </div>
    </div>
  );
}

function Profile({
  user,
  onClose,
  onSave,
  onLogout,
}) {
  const fileRef = useRef(null);

  const [avatar, setAvatar] =
    useState(user.avatar || "");

  const [username, setUsername] =
    useState(user.username || "");

  const [displayName, setDisplayName] =
    useState(user.displayName || "");

  const [bio, setBio] =
    useState(user.bio || "");

  const [error, setError] =
    useState("");

  function choosePhoto(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Выбери изображение.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("Фото должно быть меньше 1 МБ.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result);
      setError("");
    };

    reader.readAsDataURL(file);
  }

  function save(e) {
    e.preventDefault();

    setError("");

    if (username.trim().length < 3) {
      setError("Ник должен быть минимум 3 символа.");
      return;
    }

    if (displayName.trim().length < 2) {
      setError("Введите имя.");
      return;
    }

    const users = getUsers();

    const busy = users.some(
      (u) =>
        u.id !== user.id &&
        u.username.toLowerCase() ===
          username.trim().toLowerCase()
    );

    if (busy) {
      setError("Этот ник уже занят.");
      return;
    }

    const updated = {
      ...user,

      username: username.trim(),

      displayName:
        displayName.trim(),

      bio: bio.trim(),

      avatar,
    };

    saveUsers(
      users.map((u) =>
        u.id === user.id
          ? updated
          : u
      )
    );

    saveCurrent(updated);

    onSave(updated);
    onClose();
  }

  return (
    <div
      className="modal"
      onClick={onClose}
    >

      <div
        className="profile"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <button
          className="close"
          onClick={onClose}
        >
          ×
        </button>

        <h2>Мой профиль</h2>

        <p className="profile-subtitle">
          Настрой свой профиль
        </p>

        <div className="photo-area">

          <Avatar
            user={{
              ...user,
              avatar,
              username,
              displayName,
            }}
            big
          />

          <button
            className="photo-button"
            onClick={() =>
              fileRef.current?.click()
            }
          >
            {avatar
              ? "Изменить фото"
              : "Добавить фото"}
          </button>

          <input
            ref={fileRef}
            hidden
            type="file"
            accept="image/*"
            onChange={choosePhoto}
          />

          <small>
            JPG, PNG или WEBP · до 1 МБ
          </small>

        </div>

        <form onSubmit={save}>

          <label>
            Ник

            <input
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              maxLength={30}
            />
          </label>

          <label>
            Имя

            <input
              value={displayName}
              onChange={(e) =>
                setDisplayName(e.target.value)
              }
              maxLength={50}
            />
          </label>

          <label>
            Описание

            <textarea
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              placeholder="Расскажи немного о себе..."
              maxLength={160}
              rows={4}
            />
          </label>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button className="main-button">
            Сохранить
          </button>

        </form>

        <button
          className="logout"
          onClick={onLogout}
        >
          Выйти из аккаунта
        </button>

      </div>
    </div>
  );
}

function Home({ user, setUser }) {
  const [profileOpen, setProfileOpen] =
    useState(false);

  function logout() {
    localStorage.removeItem(
      CURRENT_KEY
    );

    setUser(null);
  }

  return (
    <div className="app">

      <header className="topbar">

        <div className="logo">

          <div className="logo-square">
            M
          </div>

          <span>Messenger</span>

        </div>

        <button
          className="avatar-button"
          onClick={() =>
            setProfileOpen(true)
          }
        >
          <Avatar user={user} />
        </button>

      </header>

      <main className="home">

        <div className="empty">

          <div className="people-icon">
            👥
          </div>

          <div className="online">
            <span />
            Вы в сети
          </div>

          <h1>
            Здесь скоро появятся люди
          </h1>

          <p>
            Мы только начинаем.
            <br />
            Скоро здесь появятся новые
            пользователи и ваши чаты.
          </p>

          <div className="current-user">

            <Avatar
              user={user}
            />

            <div>
              <strong>
                {user.displayName}
              </strong>

              <span>
                @{user.username}
              </span>
            </div>

            <i />

          </div>

        </div>

      </main>

      {profileOpen && (
        <Profile
          user={user}
          onClose={() =>
            setProfileOpen(false)
          }
          onSave={setUser}
          onLogout={logout}
        />
      )}

    </div>
  );
}

export default function App() {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const current = getCurrent();

    if (current) {
      setUser(current);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div>M</div>
        Messenger
      </div>
    );
  }

  if (!user) {
    return (
      <Auth
        onLogin={setUser}
      />
    );
  }

  return (
    <Home
      user={user}
      setUser={setUser}
    />
  );
}