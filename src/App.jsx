import { useEffect, useRef, useState } from "react";
import "./index.css";

const USERS_KEY = "messenger_users";
const CURRENT_USER_KEY = "messenger_current_user";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function Avatar({ user, size = "" }) {
  const letter =
    user?.displayName?.trim()?.[0]?.toUpperCase() ||
    user?.username?.trim()?.[0]?.toUpperCase() ||
    "?";

  return (
    <div className={`avatar ${size}`}>
      {user?.avatar ? (
        <img src={user.avatar} alt="Аватар" />
      ) : (
        <span>{letter}</span>
      )}
    </div>
  );
}

function Auth({ onLogin }) {
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");

    const users = getUsers();

    if (register) {
      if (username.trim().length < 3) {
        setError("Ник должен быть минимум 3 символа.");
        return;
      }

      if (displayName.trim().length < 2) {
        setError("Введите имя.");
        return;
      }

      if (password.length < 6) {
        setError("Пароль должен быть минимум 6 символов.");
        return;
      }

      if (
        users.some(
          (u) => u.email === email.trim().toLowerCase()
        )
      ) {
        setError("Такой email уже зарегистрирован.");
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
        id: crypto.randomUUID(),
        email: email.trim().toLowerCase(),
        password,
        username: username.trim(),
        displayName: displayName.trim(),
        bio: "",
        avatar: "",
      };

      users.push(user);
      saveUsers(users);
      saveCurrentUser(user);
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

    saveCurrentUser(user);
    onLogin(user);
  }

  return (
    <div className="auth-page">
      <div className="background-glow glow-1" />
      <div className="background-glow glow-2" />

      <div className="auth-card">
        <div className="logo">
          <div className="logo-icon">M</div>
          <span>Messenger</span>
        </div>

        <div className="auth-title">
          <h1>
            {register ? "Создать аккаунт" : "С возвращением"}
          </h1>

          <p>
            {register
              ? "Создайте свой профиль"
              : "Войдите в свой аккаунт"}
          </p>
        </div>

        <form onSubmit={submit}>
          {register && (
            <>
              <label>
                Ник
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="alex"
                  required
                />
              </label>

              <label>
                Имя
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button className="main-button">
            {register ? "Создать аккаунт" : "Войти"}
          </button>
        </form>

        <div className="auth-switch">
          {register ? "Уже есть аккаунт?" : "Нет аккаунта?"}

          <button
            onClick={() => {
              setRegister(!register);
              setError("");
            }}
          >
            {register ? "Войти" : "Зарегистрироваться"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Profile({ user, onClose, onSave }) {
  const inputRef = useRef(null);

  const [avatar, setAvatar] = useState(user.avatar || "");
  const [username, setUsername] = useState(user.username || "");
  const [displayName, setDisplayName] = useState(
    user.displayName || ""
  );
  const [bio, setBio] = useState(user.bio || "");
  const [error, setError] = useState("");

  function selectPhoto(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Можно выбрать только изображение.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Максимальный размер фото — 5 МБ.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result);
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

    const nicknameUsed = users.some(
      (u) =>
        u.id !== user.id &&
        u.username.toLowerCase() ===
          username.trim().toLowerCase()
    );

    if (nicknameUsed) {
      setError("Этот ник уже занят.");
      return;
    }

    const updated = {
      ...user,
      username: username.trim(),
      displayName: displayName.trim(),
      bio: bio.trim(),
      avatar,
    };

    const newUsers = users.map((u) =>
      u.id === user.id ? updated : u
    );

    saveUsers(newUsers);
    saveCurrentUser(updated);

    onSave(updated);
    onClose();
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div
        className="profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close" onClick={onClose}>
          ×
        </button>