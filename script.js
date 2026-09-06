var mode = "login";
var currentUser = null;
var selectedAvatar = "";


/* =========================
   ХРАНИЛИЩЕ
========================= */

var USERS_KEY = "meowl_users";
var CURRENT_KEY = "meowl_current";


function getUsers() {

  var data = localStorage.getItem(USERS_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (e) {
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

var authScreen =
  document.getElementById("authScreen");

var appScreen =
  document.getElementById("appScreen");

var loginTab =
  document.getElementById("loginTab");

var registerTab =
  document.getElementById("registerTab");

var authButton =
  document.getElementById("authButton");

var emailInput =
  document.getElementById("emailInput");

var passwordInput =
  document.getElementById("passwordInput");

var authError =
  document.getElementById("authError");


/* =========================
   ВХОД / РЕГИСТРАЦИЯ
========================= */

function setMode(value) {

  mode = value;

  loginTab.classList.remove("active");
  registerTab.classList.remove("active");

  if (mode === "login") {

    loginTab.classList.add("active");

    authButton.textContent =
      "Продолжить";

  } else {

    registerTab.classList.add("active");

    authButton.textContent =
      "Зарегистрироваться";
  }

  authError.textContent = "";
}


/* =========================
   КНОПКА ПРОДОЛЖИТЬ
========================= */

function auth() {

  var email =
    emailInput.value.trim().toLowerCase();

  var password =
    passwordInput.value;


  authError.textContent = "";


  if (email === "" || password === "") {

    authError.textContent =
      "Заполни почту и пароль";

    return;
  }


  if (mode === "login") {

    doLogin(email, password);

  } else {

    doRegister(email, password);

  }
}


/* =========================
   ВХОД
========================= */

function doLogin(email, password) {

  var users = getUsers();

  var user = null;


  for (var i = 0; i < users.length; i++) {

    if (users[i].email === email) {

      user = users[i];

      break;
    }
  }


  if (user === null) {

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

function doRegister(email, password) {

  if (email.indexOf("@") === -1) {

    authError.textContent =
      "Введи правильную почту";

    return;
  }


  if (password.length < 4) {

    authError.textContent =
      "Пароль должен быть минимум 4 символа";

    return;
  }


  var users = getUsers();


  for (var i = 0; i < users.length; i++) {

    if (users[i].email === email) {

      authError.textContent =
        "Этот аккаунт уже существует";

      return;
    }
  }


  var user = {

    email: email,

    password: password,

    profile: {

      nickname:
        email.split("@")[0],

      description: "",

      avatar: ""
    }
  };


  users.push(user);

  saveUsers(users);


  currentUser = user;


  localStorage.setItem(
    CURRENT_KEY,
    email
  );


  openApp();
}


/* =========================
   ОТКРЫТЬ ПРИЛОЖЕНИЕ
========================= */

function openApp() {

  authScreen.style.display = "none";

  appScreen.style.display = "block";


  document.getElementById(
    "emailLabel"
  ).textContent =
    currentUser.email;


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


  document.getElementById(
    "pageTitle"
  ).textContent = "Чаты";


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


  document.getElementById(
    "pageTitle"
  ).textContent = "Профиль";


  document
    .getElementById("chatsButton")
    .classList.remove("active");


  document
    .getElementById("profileButton")
    .classList.add("active");


  loadProfile();
}


/* =========================
   ЗАГРУЗКА ПРОФИЛЯ
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


  var profile =
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


  var image =
    document.getElementById("avatarImage");

  var defaultAvatar =
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
   ИЗМЕНИТЬ ПРОФИЛЬ
========================= */

function openEdit() {

  var profile =
    currentUser.profile;


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
   ОТМЕНА
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
   ФОТО
========================= */

function choosePhoto() {

  document
    .getElementById("photoInput")
    .click();
}


function photoChanged(event) {

  var file =
    event.target.files[0];


  if (!file) {
    return;
  }


  if (file.type.indexOf("image/") !== 0) {

    alert("Выбери изображение");

    return;
  }


  var reader =
    new FileReader();


  reader.onload = function() {

    selectedAvatar =
      reader.result;
  };


  reader.readAsDataURL(file);
}


/* =========================
   СОХРАНИТЬ
========================= */

function saveProfile() {

  var nickname =
    document
      .getElementById("nicknameInput")
      .value
      .trim();


  var description =
    document
      .getElementById("descriptionInput")
      .value
      .trim();


  if (nickname === "") {

    alert("Введи ник");

    return;
  }


  currentUser.profile = {

    nickname: nickname,

    description: description,

    avatar: selectedAvatar
  };


  var users = getUsers();


  for (var i = 0; i < users.length; i++) {

    if (
      users[i].email ===
      currentUser.email
    ) {

      users[i] = currentUser;

      break;
    }
  }


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
   КНОПКИ
========================= */

loginTab.addEventListener(
  "click",
  function() {
    setMode("login");
  }
);


registerTab.addEventListener(
  "click",
  function() {
    setMode("register");
  }
);


authButton.addEventListener(
  "click",
  function() {
    auth();
  }
);


document
  .getElementById("logoutButton")
  .addEventListener(
    "click",
    logout
  );


document
  .getElementById("chatsButton")
  .addEventListener(
    "click",
    showChats
  );


document
  .getElementById("profileButton")
  .addEventListener(
    "click",
    showProfile
  );


document
  .getElementById("editProfileButton")
  .addEventListener(
    "click",
    openEdit
  );


document
  .getElementById("photoButton")
  .addEventListener(
    "click",
    choosePhoto
  );


document
  .getElementById("photoInput")
  .addEventListener(
    "change",
    photoChanged
  );


document
  .getElementById("saveProfileButton")
  .addEventListener(
    "click",
    saveProfile
  );


document
  .getElementById("cancelProfileButton")
  .addEventListener(
    "click",
    closeEdit
  );


/* ENTER */

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

    var savedEmail =
      localStorage.getItem(
        CURRENT_KEY
      );


    if (!savedEmail) {
      return;
    }


    var users = getUsers();

    var user = null;


    for (var i = 0; i < users.length; i++) {

      if (
        users[i].email ===
        savedEmail
      ) {

        user = users[i];

        break;
      }
    }


    if (user) {

      currentUser = user;

      openApp();

    } else {

      localStorage.removeItem(
        CURRENT_KEY
      );
    }

  }
);