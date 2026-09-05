// ============================================================
// MeowI Messenger
// GitHub Pages + Supabase
// ============================================================

// ============================================================
// 1. ДАННЫЕ SUPABASE
// ============================================================

const SUPABASE_URL = "https://ehkdidgjiszpqqajsxsu.supabase.co";
const SUPABASE_KEY = "sb_publishable_5-1jR2q3JRmXTAjksWFndA_yraWCUD2";

// Проверяем, вставлены ли ключи
if (
  SUPABASE_URL.includes("ТВОЙ_") ||
  SUPABASE_KEY.includes("ТВОЙ_")
) {
  console.warn(
    "В app.js нужно вставить SUPABASE_URL и SUPABASE_KEY."
  );
}

// Создаём Supabase
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ============================================================
// 2. СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ============================================================

let currentUser = null;
let currentProfile = null;
let selectedFriend = null;
let realtimeChannel = null;


// ============================================================
// 3. HTML ЭКРАН АВТОРИЗАЦИИ
// ============================================================

function showAuth() {
  document.getElementById("app").innerHTML = `
    <div class="auth-page">

      <div class="auth-card">

        <div class="logo">
          <div class="logo-cat">😺</div>
          <h1>MeowI</h1>
          <p>Messenger</p>
        </div>

        <div class="auth-tabs">
          <button
            id="registerTab"
            class="auth-tab active"
            onclick="showRegister()"
          >
            Зарегистрироваться
          </button>

          <button
            id="loginTab"
            class="auth-tab"
            onclick="showLogin()"
          >
            Войти
          </button>
        </div>

        <div id="authForm"></div>

      </div>

    </div>
  `;

  showRegister();
}


// ============================================================
// 4. РЕГИСТРАЦИЯ
// ============================================================

function showRegister() {

  document.getElementById("registerTab").classList.add("active");
  document.getElementById("loginTab").classList.remove("active");

  document.getElementById("authForm").innerHTML = `

    <form onsubmit="registerUser(event)">

      <label>Имя</label>

      <input
        id="registerName"
        type="text"
        placeholder="Ваше имя"
        required
        minlength="2"
        maxlength="50"
      >

      <label>Username</label>

      <input
        id="registerUsername"
        type="text"
        placeholder="@username"
        required
        minlength="3"
        maxlength="30"
      >

      <small class="input-help">
        По этому имени друзья смогут вас найти
      </small>

      <label>Email</label>

      <input
        id="registerEmail"
        type="email"
        placeholder="example@mail.com"
        required
      >

      <label>Пароль</label>

      <input
        id="registerPassword"
        type="password"
        placeholder="Минимум 6 символов"
        required
        minlength="6"
      >

      <label>Повторите пароль</label>

      <input
        id="registerPassword2"
        type="password"
        placeholder="Повторите пароль"
        required
        minlength="6"
      >

      <button
        class="main-button"
        type="submit"
      >
        Зарегистрироваться
      </button>

      <div id="authMessage"></div>

    </form>
  `;
}


// ============================================================
// 5. ВХОД
// ============================================================

function showLogin() {

  document.getElementById("loginTab").classList.add("active");
  document.getElementById("registerTab").classList.remove("active");

  document.getElementById("authForm").innerHTML = `

    <form onsubmit="loginUser(event)">

      <label>Email</label>

      <input
        id="loginEmail"
        type="email"
        placeholder="example@mail.com"
        required
      >

      <label>Пароль</label>

      <input
        id="loginPassword"
        type="password"
        placeholder="Ваш пароль"
        required
      >

      <button
        class="main-button"
        type="submit"
      >
        Войти
      </button>

      <div id="authMessage"></div>

    </form>
  `;
}


// ============================================================
// 6. ПОКАЗ СООБЩЕНИЯ ОБ ОШИБКЕ
// ============================================================

function authMessage(text, type = "error") {

  const element = document.getElementById("authMessage");

  if (!element) return;

  element.innerHTML = `
    <div class="auth-message ${type}">
      ${esc(text)}
    </div>
  `;
}


// ============================================================
// 7. РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
// ============================================================

async function registerUser(event) {

  event.preventDefault();

  const name =
    document.getElementById("registerName").value.trim();

  let username =
    document.getElementById("registerUsername").value.trim();

  const email =
    document.getElementById("registerEmail").value.trim();

  const password =
    document.getElementById("registerPassword").value;

  const password2 =
    document.getElementById("registerPassword2").value;


  // Проверка паролей

  if (password !== password2) {
    authMessage("Пароли не совпадают.");
    return;
  }


  // Проверка username

  username = username
    .replace(/^@+/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");


  if (username.length < 3) {
    authMessage(
      "Username должен содержать минимум 3 символа."
    );
    return;
  }


  // Проверяем, свободен ли username

  const { data: existingProfile, error: usernameError } =
    await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();


  if (usernameError) {

    console.error(usernameError);

    authMessage(
      "Не удалось проверить username. Проверь настройки Supabase."
    );

    return;
  }


  if (existingProfile) {

    authMessage(
      "Этот username уже занят. Выбери другой."
    );

    return;
  }


  authMessage(
    "Создаём аккаунт...",
    "success"
  );


  // Создаём пользователя Supabase Auth

  const {
    data,
    error
/* ==========================================
   MeowI Messenger
   GitHub Pages version
========================================== */

const DB_KEY = "meowi_database";
const SESSION_KEY = "meowi_session";

let authMode = "register";
let selectedUserId = null;

/* ==========================================
   DATABASE
========================================== */

function getDatabase() {

    const saved = localStorage.getItem(DB_KEY);

    if (!saved) {
        const db = {
            users: [],
            messages: []
        };

        localStorage.setItem(DB_KEY, JSON.stringify(db));

        return db;
    }

    try {
        return JSON.parse(saved);
    } catch {
        return {
            users: [],
            messages: []
        };
    }
}

function saveDatabase(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getCurrentUser() {

    const id = localStorage.getItem(SESSION_KEY);

    if (!id) {
        return null;
    }

    const db = getDatabase();

    return db.users.find(user => user.id === id) || null;
}

function createId() {

    return Date.now().toString(36) +
           Math.random().toString(36).substring(2);
}

/* ==========================================
   HELPERS
========================================== */

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getInitial(name) {

    return escapeHTML(
        name.trim().charAt(0).toUpperCase()
    );
}

function formatTime(timestamp) {

    return new Date(timestamp)
        .toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit"
        });
}

/* ==========================================
   AUTH SCREEN
========================================== */

function showAuth() {

    document.querySelector("#app").innerHTML = `

        <div class="auth-page">

            <div class="auth-card">

                <div class="logo">😺</div>

                <h1>MeowI Messenger</h1>

                <p class="auth-description">
                    Общайся с друзьями
                </p>

                <div class="tabs">

                    <button
                        id="registerTab"
                        class="tab active">
                        Регистрация
                    </button>

                    <button
                        id="loginTab"
                        class="tab">
                        Войти
                    </button>

                </div>

                <form id="authForm">

                    <div
                        id="nameField"
                        class="field">

                        <label>
                            Имя
                        </label>

                        <input
                            id="nameInput"
                            type="text"
                            maxlength="30"
                            placeholder="Например, Егор"
                            required>

                    </div>

                    <div class="field">

                        <label>
                            Email
                        </label>

                        <input
                            id="emailInput"
                            type="email"
                            placeholder="you@example.com"
                            required>

                    </div>

                    <div class="field">

                        <label>
                            Пароль
                        </label>

                        <input
                            id="passwordInput"
                            type="password"
                            minlength="6"
                            placeholder="Минимум 6 символов"
                            required>

                    </div>

                    <div
                        id="error"
                        class="error hidden">
                    </div>

                    <button
                        id="authButton"
                        class="main-button"
                        type="submit">

                        📝 Зарегистрироваться

                    </button>

                </form>

                <button
                    id="demoButton"
                    class="secondary-button"
                    type="button">

                    👀 Посмотреть демо

                </button>

            </div>

        </div>
    `;

    document.querySelector("#registerTab")
        .onclick = () => changeAuthMode("register");

    document.querySelector("#loginTab")
        .onclick = () => changeAuthMode("login");

    document.querySelector("#authForm")
        .onsubmit = handleAuth;

    document.querySelector("#demoButton")
        .onclick = createDemoAccount;
}

/* ==========================================
   AUTH MODE
========================================== */

function changeAuthMode(mode) {

    authMode = mode;

    const register =
        mode === "register";

    document.querySelector("#registerTab")
        .classList.toggle("active", register);

    document.querySelector("#loginTab")
        .classList.toggle("active", !register);

    document.querySelector("#nameField")
        .classList.toggle("hidden", !register);

    document.querySelector("#nameInput")
        .required = register;

    document.querySelector("#authButton")
        .textContent = register
            ? "📝 Зарегистрироваться"
            : "🔑 Войти";

    document.querySelector("#passwordInput")
        .value = "";

    hideError();
}

/* ==========================================
   AUTH
========================================== */

function handleAuth(event) {

    event.preventDefault();

    const db = getDatabase();

    const name =
        document.querySelector("#nameInput")
            .value.trim();

    const email =
        document.querySelector("#emailInput")
            .value.trim()
            .toLowerCase();

    const password =
        document.querySelector("#passwordInput")
            .value;

    if (password.length < 6) {

        showError(
            "Пароль должен содержать минимум 6 символов."
        );

        return;
    }

    if (authMode === "register") {

        if (name.length < 2) {

            showError(
                "Введите имя."
            );

            return;
        }

        const exists =
            db.users.some(
                user => user.email === email
            );

        if (exists) {

            showError(
                "Этот email уже зарегистрирован."
            );

            return;
        }

        const user = {

            id: createId(),

            name,

            email,

            password,

            createdAt: Date.now()

        };

        db.users.push(user);

        saveDatabase(db);

        localStorage.setItem(
            SESSION_KEY,
            user.id
        );

        showMessenger();

        return;
    }

    const user =
        db.users.find(
            user =>
                user.email === email &&
                user.password === password
        );

    if (!user) {

        showError(
            "Неверный email или пароль."
        );

        return;
    }

    localStorage.setItem(
        SESSION_KEY,
        user.id
    );

    showMessenger();
}

/* ==========================================
   DEMO
========================================== */

function createDemoAccount() {

    const db = getDatabase();

    let demo =
        db.users.find(
            user =>
                user.email === "demo@meowi.test"
        );

    if (!demo) {

        demo = {

            id: createId(),

            name: "MeowI Demo",

            email: "demo@meowi.test",

            password: "123456",

            createdAt: Date.now()

        };

        db.users.push(demo);

        saveDatabase(db);
    }

    localStorage.setItem(
        SESSION_KEY,
        demo.id
    );

    showMessenger();
}

/* ==========================================
   ERRORS
========================================== */

function showError(text) {

    const error =
        document.querySelector("#error");

    error.textContent = text;

    error.classList.remove("hidden");
}

function hideError() {

    const error =
        document.querySelector("#error");

    if (error) {
        error.classList.add("hidden");
    }
}

/* ==========================================
   MESSENGER
========================================== */

function showMessenger() {

    const user = getCurrentUser();

    if (!user) {

        showAuth();

        return;
    }

    document.querySelector("#app").innerHTML = `

        <div
            id="messenger"
            class="messenger">

            <aside class="sidebar">

                <div class="sidebar-header">

                    <div class="sidebar-title">

                        <h2>
                            Сообщения
                        </h2>

                        <button
                            id="newChatButton"
                            class="new-chat">
                            +
                        </button>

                    </div>

                    <div class="profile-small">

                        <div class="avatar">
                            ${getInitial(user.name)}
                        </div>

                        <div class="profile-small-text">

                            <strong>
                                ${escapeHTML(user.name)}
                            </strong>

                            <span>
                                ${escapeHTML(user.email)}
                            </span>

                        </div>

                    </div>

                    <input
                        id="searchInput"
                        class="search"
                        placeholder="Поиск пользователей...">

                </div>

                <div
                    id="chatList"
                    class="chat-list">
                </div>

                <div class="logout-area">

                    <button
                        id="logoutButton"
                        class="logout">

                        🚪 Выйти

                    </button>

                </div>

            </aside>


            <section class="chat">

                <header class="chat-header">

                    <button
                        id="backButton"
                        class="back-button">
                        ‹
                    </button>

                    <div
                        id="chatAvatar"
                        class="avatar">
                        💬
                    </div>

                    <div
                        id="chatHeaderInfo"
                        class="chat-header-info">

                        <strong>
                            Выбери собеседника
                        </strong>

                    </div>

                </header>

                <div
                    id="messages"
                    class="messages">

                    <div class="empty-chat">

                        <div class="empty-chat-icon">
                            💬
                        </div>

                        <h2>
                            MeowI Messenger
                        </h2>

                        <p>
                            Выбери пользователя,
                            чтобы начать чат.
                        </p>

                    </div>

                </div>

                <form
                    id="messageForm"
                    class="message-form">

                    <input
                        id="messageInput"
                        class="message-input"
                        placeholder="Напиши сообщение..."
                        disabled>

                    <button
                        class="send-button"
                        type="submit"
                        disabled>

                        ➤

                    </button>

                </form>

            </section>

        </div>
    `;

    document.querySelector("#logoutButton")
        .onclick = logout;

    document.querySelector("#newChatButton")
        .onclick = openNewChat;

    document.querySelector("#searchInput")
        .oninput = renderUserList;

    document.querySelector("#messageForm")
        .onsubmit = sendMessage;

    document.querySelector("#backButton")
        .onclick = () => {

            document
                .querySelector("#messenger")
                .classList.remove("chat-open");
        };

    renderUserList();
}

/* ==========================================
   USER LIST
========================================== */

function renderUserList() {

    const db = getDatabase();

    const me = getCurrentUser();

    const search =
        document.querySelector("#searchInput")
            ?.value
            .toLowerCase()
            .trim() || "";

    const list =
        document.querySelector("#chatList");

    if (!list) return;

    let users =
        db.users.filter(
            user => user.id !== me.id
        );

    users =
        users.filter(
            user =>
                user.name
                    .toLowerCase()
                    .includes(search) ||

                user.email
                    .toLowerCase()
                    .includes(search)
        );

    if (users.length === 0) {

        list.innerHTML = `

            <div class="empty-chat">

                <p>
                    Других пользователей пока нет.
                </p>

                <button
                    class="secondary-button"
                    onclick="openNewChat()">

                    ➕ Новый чат

                </button>

            </div>
        `;

        return;
    }

    list.innerHTML =
        users.map(user => {

            const active =
                selectedUserId === user.id
                    ? "active"
                    : "";

            const last =
                db.messages
                    .filter(
                        message =>
                            (
                                message.from === me.id &&
                                message.to === user.id
                            ) ||
                            (
                                message.from === user.id &&
                                message.to === me.id
                            )
                    )
                    .sort(
                        (a,b) => a.time - b.time
                    )
                    .at(-1);

            return `

                <button
                    class="chat-user ${active}"
                    data-id="${user.id}">

                    <div class="avatar">

                        ${getInitial(user.name)}

                    </div>

                    <div class="chat-user-info">

                        <div class="chat-user-name">

                            ${escapeHTML(user.name)}

                        </div>

                        <div class="chat-user-email">

                            ${
                                last
                                    ? escapeHTML(last.text)
                                    : escapeHTML(user.email)
                            }

                        </div>

                    </div>

                </button>

            `;

        }).join("");

    document
        .querySelectorAll(".chat-user")
        .forEach(button => {

            button.onclick = () => {

                openChat(
                    button.dataset.id
                );

            };

        });
}

/* ==========================================
   OPEN CHAT
========================================== */

function openChat(userId) {

    const db = getDatabase();

    const user =
        db.users.find(
            user => user.id === userId
        );

    if (!user) return;

    selectedUserId = userId;

    document
        .querySelector("#messenger")
        .classList.add("chat-open");

    document.querySelector("#chatAvatar")
        .textContent =
        getInitial(user.name);

    document.querySelector("#chatHeaderInfo")
        .innerHTML = `

            <strong>
                ${escapeHTML(user.name)}
            </strong>

            <div class="online">
                ● в сети
            </div>
        `;

    document.querySelector("#messageInput")
        .disabled = false;

    document.querySelector(".send-button")
        .disabled = false;

    renderMessages();

    renderUserList();

    document
        .querySelector("#messageInput")
        .focus();
}

/* ==========================================
   MESSAGES
========================================== */

function renderMessages() {

    const box =
        document.querySelector("#messages");

    if (!box || !selectedUserId)
        return;

    const db = getDatabase();

    const me = getCurrentUser();

    const messages =
        db.messages
            .filter(
                message =>
                    (
                        message.from === me.id &&
                        message.to === selectedUserId
                    ) ||
                    (
                        message.from === selectedUserId &&
                        message.to === me.id
                    )
            )
            .sort(
                (a,b) => a.time - b.time
            );

    if (messages.length === 0) {

        box.innerHTML = `

            <div class="empty-chat">

                <div class="empty-chat-icon">
                    👋
                </div>

                <h3>
                    Пока сообщений нет
                </h3>

                <p>
                    Напиши первым!
                </p>

            </div>

        `;

        return;
    }

    box.innerHTML =
        messages.map(message => {

            const mine =
                message.from === me.id;

            return `

                <div
                    class="message ${
                        mine ? "mine" : ""
                    }">

                    ${escapeHTML(message.text)}

                    <div class="message-time">

                        ${formatTime(message.time)}

                    </div>

                </div>

            `;

        }).join("");

    box.scrollTop =
        box.scrollHeight;
}

/* ==========================================
   SEND MESSAGE
========================================== */

function sendMessage(event) {

    event.preventDefault();

    if (!selectedUserId)
        return;

    const input =
        document.querySelector("#messageInput");

    const text =
        input.value.trim();

    if (!text)
        return;

    const db = getDatabase();

    const me = getCurrentUser();

    db.messages.push({

        id: createId(),

        from: me.id,

        to: selectedUserId,

        text: text,

        time: Date.now()

    });

    saveDatabase(db);

    input.value = "";

    renderMessages();

    renderUserList();

    input.focus();
}

/* ==========================================
   NEW CHAT
========================================== */

function openNewChat() {

    const db = getDatabase();

    const me = getCurrentUser();

    const users =
        db.users.filter(
            user => user.id !== me.id
        );

    if (!users.length) {

        alert(
            "Пока нет других пользователей. Зарегистрируй второй аккаунт в другом браузере или режиме инкогнито."
        );

        return;
    }

    const name =
        prompt(
            "Введи имя пользователя:"
        );

    if (!name)
        return;

    const user =
        users.find(
            user =>
                user.name
                    .toLowerCase() ===
                name.trim().toLowerCase()
        );

    if (!user) {

        alert(
            "Пользователь не найден."
        );

        return;
    }

    openChat(user.id);
}

/* ==========================================
   LOGOUT
========================================== */

function logout() {

    selectedUserId = null;

    localStorage.removeItem(
        SESSION_KEY
    );

    showAuth();
}

/* ==========================================
   START
========================================== */

if (getCurrentUser()) {

    showMessenger();

} else {

    showAuth();

}