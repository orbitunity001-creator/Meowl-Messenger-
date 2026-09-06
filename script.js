const USERS_KEY = "meowl_users";
const CURRENT_KEY = "meowl_current";

let mode = "login";
let currentUser = null;
let selectedAvatar = "";


/* =========================
   ПОЛЬЗОВАТЕЛИ
========================= */

function getUsers() {

  const data =
    localStorage.getItem(USERS_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}


function saveUsers(users) {

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
}


/* =========================
   ЭЛЕМЕНТЫ
========================= */

const authScreen =
  document.getElementById("authScreen");

const appScreen =
  document.getElementById("appScreen");

const loginTab =
  document.getElementById("loginTab");

const registerTab =
  document.getElementById("registerTab");

const authButton =
  document.getElementById("authButton");

const emailInput =
  document.getElementById("emailInput");

const passwordInput =
  document.getElementById("passwordInput");

const authError =
  document.getElementById("authError");


/* =========================
   РЕЖИМ ВХОДА
========================= */

function setMode(newMode) {

  mode = newMode;

  loginTab.classList.toggle(
    "active",
    mode === "login"
  );

  registerTab.classList.toggle(
    "active",
    mode === "register"
  );

  authButton.textContent =
    mode === "login"
      ? "Войти"
      : "Зарегистрироваться";

  authError.textContent = "";
}


/* =========================
   ВХОД
========================= */

function login() {

  const email =
    emailInput.value.trim().toLowerCase();

  const password =
    passwordInput.value;

  if (!email || !password) {

    authError.textContent =
      "Заполни все поля";

    return;
  }


  const users = getUsers();

  const user = users.find(
    item => item.email === email
  );


  if (!user) {

    authError.textContent =
      "Аккаунт не найден";

    return;
  }


  if (user.password !== password) {

    authError.textContent =
      "Неверный пароль";

    return;
  }


  currentUser = user;

  localStorage.setItem(
    CURRENT_KEY,
    email
  );

  openApp();
}


/* =========================
   РЕГИСТРАЦИЯ
========================= */

function register() {

  const email =
    emailInput.value.trim().toLowerCase();

  const password =
    passwordInput.value;


  if (!email || !password) {

    authError.textContent =
      "Заполни все поля";

    return;
  }


  if (!email.includes("@")) {

    authError.textContent =
      "Введи правильную почту";

    return;
  }


  if (password.length < 4) {

    authError.textContent =
      "Пароль должен быть минимум 4 символа";

    return;
  }


  const users = getUsers();


  const exists = users.find(
    item => item.email === email
  );


  if (exists) {

    authError.textContent =
      "Этот аккаунт уже существует";

    return;
  }


  const newUser = {

    email: email,

    password: password,

    profile: {

      nickname:
        email.split("@")[0],

      description: "",

      avatar: ""

    }

  };


  users.push(newUser);

  saveUsers(users);


  currentUser = newUser;


  localStorage.setItem(
    CURRENT_KEY,
    email
  );


  openApp();
}


/* =========================
   АВТОРИЗАЦИЯ
========================= */

function auth() {

  if (mode === "login") {

    login();

  } else {

    register();

  }
}


/* =========================
   ОТКРЫТЬ ПРИЛОЖЕНИЕ
========================= */

function openApp() {

  authScreen.style.display = "none";

  appScreen.style.display = "block";

  document.getElementById(
    "emailLabel"
  ).textContent = currentUser.email;

  showChats();
}


/* =========================
   ЧАТЫ
========================= */

function showChats() {

  document
    .getElementById("chatsPage")
    .classList.remove("hidden");

  document
    .getElementById("profilePage")
    .classList.add("hidden");

  document
    .getElementById("pageTitle")
    .textContent = "Чаты";


  document
    .getElementById("chatsButton")
    .classList.add("active");

  document
    .getElementById("profileButton")
    .classList.remove("active");
}


/* =========================
   ПРОФИЛЬ
========================= */

function showProfile() {

  document
    .getElementById("chatsPage")
    .classList.add("hidden");

  document
    .getElementById("profilePage")
    .classList.remove("hidden");

  document
    .getElementById("pageTitle")
    .textContent = "Профиль";


  document
    .getElementById("chatsButton")
    .classList.remove("active");

  document
    .getElementById("profileButton")
    .classList.add("active");


  loadProfile();
}


/* =========================
   ЗАГРУЗИТЬ ПРОФИЛЬ
========================= */

function loadProfile() {

  if (!currentUser) {
    return;
  }


  if (!currentUser.profile) {

    currentUser.profile = {

      nickname:
        currentUser.email.split("@")[0],

      description: "",

      avatar: ""

    };
  }


  const profile =
    currentUser.profile;


  document.getElementById(
    "profileNickname"
  ).textContent =
    profile.nickname || "Ник";


  document.getElementById(
    "profileDescription"
  ).textContent =
    profile.description ||
    "Описание профиля";


  const image =
    document.getElementById("avatarImage");

  const defaultAvatar =
    document.getElementById("avatarDefault");


  if (profile.avatar) {

    image.src = profile.avatar;

    image.style.display = "block";

    defaultAvatar.style.display =
      "none";

  } else {

    image.src = "";

    image.style.display = "none";

    defaultAvatar.style.display =
      "block";
  }
}


/* =========================
   РЕДАКТИРОВАТЬ
========================= */

function openEdit() {

  const profile =
    currentUser.profile || {};


  document.getElementById(
    "nicknameInput"
  ).value =
    profile.nickname || "";


  document.getElementById(
    "descriptionInput"
  ).value =
    profile.description || "";


  document.getElementById(
    "profileEmail"
  ).value =
    currentUser.email;


  selectedAvatar =
    profile.avatar || "";


  document
    .getElementById("editProfile")
    .classList.remove("hidden");
}


/* =========================
   ЗАКРЫТЬ РЕДАКТИРОВАНИЕ
========================= */

function closeEdit() {

  document
    .getElementById("editProfile")
    .classList.add("hidden");

  selectedAvatar = "";

  document.getElementById(
    "photoInput"
  ).value = "";
}


/* =========================
   ВЫБРАТЬ ФОТО
========================= */

function choosePhoto() {

  document
    .getElementById("photoInput")
    .click();
}


/* =========================
   ФОТО ВЫБРАНО
========================= */

function photoChanged(event) {

  const file =
    event.target.files[0];

  if (!file) {
    return;
  }


  if (!file.type.startsWith("image/")) {

    alert("Выбери изображение");

    return;
  }


  const reader =
    new FileReader();


  reader.onload = function(e) {

    selectedAvatar =
      e.target.result;

  };


  reader.readAsDataURL(file);
}


/* =========================
   СОХРАНИТЬ ПРОФИЛЬ
========================= */

function saveProfile() {

  const nickname =
    document
      .getElementById("nicknameInput")
      .value
      .trim();


  const description =
    document
      .getElementById("descriptionInput")
      .value
      .trim();


  if (!nickname) {

    alert("Введи ник");

    return;
  }


  currentUser.profile = {

    nickname: nickname,

    description: description,

    avatar: selectedAvatar

  };


  const users =
    getUsers();


  const index =
    users.findIndex(
      user =>
        user.email ===
        currentUser.email
    );


  if (index === -1) {

    alert("Ошибка сохранения");

    return;
  }


  users[index] =
    currentUser;


  saveUsers(users);


  localStorage.setItem(
    CURRENT_KEY,
    currentUser.email
  );


  loadProfile();

  closeEdit();
}


/* =========================
   ВЫХОД
========================= */

function logout() {

  localStorage.removeItem(
    CURRENT_KEY
  );

  currentUser = null;

  selectedAvatar = "";


  appScreen.style.display =
    "none";

  authScreen.style.display =
    "flex";


  emailInput.value = "";

  passwordInput.value = "";

  authError.textContent = "";

  setMode("login");
}


/* =========================
   ВСЕ КНОПКИ
========================= */

loginTab.onclick = function() {
  setMode("login");
};


registerTab.onclick = function() {
  setMode("register");
};


authButton.onclick = function() {
  auth();
};


document.getElementById(
  "logoutButton"
).onclick = function() {
  logout();
};


document.getElementById(
  "chatsButton"
).onclick = function() {
  showChats();
};


document.getElementById(
  "profileButton"
).onclick = function() {
  showProfile();
};


document.getElementById(
  "editProfileButton"
).onclick = function() {
  openEdit();
};


document.getElementById(
  "photoButton"
).onclick = function() {
  choosePhoto();
};


document.getElementById(
  "photoInput"
).onchange = function(event) {
  photoChanged(event);
};


document.getElementById(
  "saveProfileButton"
).onclick = function() {
  saveProfile();
};


document.getElementById(
  "cancelProfileButton"
).onclick = function() {
  closeEdit();
};


/* =========================
   ENTER
========================= */

emailInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {
      auth();
    }

  }
);


passwordInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {
      auth();
    }

  }
);


/* =========================
   АВТОВХОД
========================= */

window.addEventListener(
  "load",
  function() {

    const savedEmail =
      localStorage.getItem(
        CURRENT_KEY
      );


    if (!savedEmail) {
      return;
    }


    const users =
      getUsers();


    const user =
      users.find(
        item =>
          item.email ===
          savedEmail
      );


    if (!user) {

      localStorage.removeItem(
        CURRENT_KEY
      );

      return;
    }


    currentUser = user;

    openApp();
  }
);