let mode = "login";

const authScreen = document.getElementById("authScreen");
const appScreen = document.getElementById("appScreen");

function getUsers() {
  return JSON.parse(localStorage.getItem("messengerUsers") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("messengerUsers", JSON.stringify(users));
}

function setMode(newMode) {
  mode = newMode;

  document.getElementById("loginTab").classList.toggle(
    "active",
    mode === "login"
  );

  document.getElementById("registerTab").classList.toggle(
    "active",
    mode === "register"
  );

  document.getElementById("authButtonText").textContent =
    mode === "login" ? "Войти" : "Создать аккаунт";

  document.getElementById("error").textContent = "";
}

function auth() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  error.textContent = "";

  if (!email || !password) {
    error.textContent = "Заполни все поля";
    return;
  }

  if (password.length < 4) {
    error.textContent = "Пароль должен быть минимум 4 символа";
    return;
  }

  const users = getUsers();

  if (mode === "register") {
    if (users[email]) {
      error.textContent = "Такой аккаунт уже существует";
      return;
    }

    users[email] = {
      email: email,
      password: password,
      profile: {
        nickname: email.split("@")[0],
        description: "",
        avatar: ""
      }
    };

    saveUsers(users);

    localStorage.setItem("messengerCurrentUser", email);

    openMessenger();
  } else {
    if (!users[email]) {
      error.textContent = "Аккаунт не найден";
      return;
    }

    if (users[email].password !== password) {
      error.textContent = "Неверный пароль";
      return;
    }

    localStorage.setItem("messengerCurrentUser", email);

    openMessenger();
  }
}

function openMessenger() {
  const email = localStorage.getItem("messengerCurrentUser");
  const users = getUsers();

  if (!email || !users[email]) {
    return;
  }

  authScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");

  document.getElementById("userEmail").textContent = email;

  loadProfile();
  showChats();
}

function loadProfile() {
  const email = localStorage.getItem("messengerCurrentUser");
  const users = getUsers();

  if (!email || !users[email]) return;

  const profile = users[email].profile || {};

  document.getElementById("nickname").value =
    profile.nickname || email.split("@")[0];

  document.getElementById("description").value =
    profile.description || "";

  document.getElementById("profileEmail").value = email;

  setAvatar(profile.avatar);
}

function setAvatar(avatar) {
  const preview = document.getElementById("avatarPreview");

  if (avatar) {
    preview.src = avatar;
  } else {
    preview.src =
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
          <rect width="100%" height="100%" fill="#20212a"/>
          <text x="50%" y="55%" text-anchor="middle"
                font-size="80" fill="white">👤</text>
        </svg>
      `);
  }
}

document.getElementById("avatarInput").addEventListener("change", function () {
  const file = this.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Выбери изображение");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    setAvatar(event.target.result);
  };

  reader.readAsDataURL(file);
});

function saveProfile() {
  const email = localStorage.getItem("messengerCurrentUser");
  const users = getUsers();

  if (!email || !users[email]) return;

  const nickname = document.getElementById("nickname").value.trim();
  const description = document.getElementById("description").value.trim();
  const avatar = document.getElementById("avatarPreview").src;

  if (!nickname) {
    document.getElementById("profileMessage").textContent =
      "Введите никнейм";
    return;
  }

  users[email].profile = {
    nickname: nickname,
    description: description,
    avatar: avatar
  };

  saveUsers(users);

  document.getElementById("profileMessage").textContent =
    "✓ Профиль сохранён";

  setTimeout(() => {
    document.getElementById("profileMessage").textContent = "";
  }, 2000);
}

function showChats() {
  document.getElementById("chatsPage").classList.remove("hidden");
  document.getElementById("profilePage").classList.add("hidden");

  document.getElementById("pageTitle").textContent = "Чаты";

  document.getElementById("chatsNav").classList.add("active");
  document.getElementById("profileNav").classList.remove("active");
}

function showProfile() {
  document.getElementById("chatsPage").classList.add("hidden");
  document.getElementById("profilePage").classList.remove("hidden");

  document.getElementById("pageTitle").textContent = "Профиль";

  document.getElementById("chatsNav").classList.remove("active");
  document.getElementById("profileNav").classList.add("active");

  loadProfile();
}

function logout() {
  localStorage.removeItem("messengerCurrentUser");

  appScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");

  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("error").textContent = "";

  setMode("login");
}

/* Автоматический вход */
window.addEventListener("load", function () {
  const currentUser = localStorage.getItem("messengerCurrentUser");

  if (currentUser) {
    openMessenger();
  }
});