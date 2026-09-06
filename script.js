let mode = "login";
let newAvatar = "";


/* =========================
   ПОЛЬЗОВАТЕЛИ
========================= */

function getUsers() {
  return JSON.parse(
    localStorage.getItem("messengerUsers") || "{}"
  );
}

function saveUsers(users) {
  localStorage.setItem(
    "messengerUsers",
    JSON.stringify(users)
  );
}

function currentEmail() {
  return localStorage.getItem(
    "messengerCurrentUser"
  );
}


/* =========================
   ВХОД / РЕГИСТРАЦИЯ
========================= */

function setMode(value) {

  mode = value;

  document
    .getElementById("loginTab")
    .classList.toggle(
      "active",
      mode === "login"
    );

  document
    .getElementById("registerTab")
    .classList.toggle(
      "active",
      mode === "register"
    );

  document.getElementById(
    "authButtonText"
  ).textContent =
    mode === "login"
      ? "Войти"
      : "Создать аккаунт";

  document.getElementById(
    "error"
  ).textContent = "";
}


function auth() {

  const email =
    document
      .getElementById("email")
      .value
      .trim()
      .toLowerCase();

  const password =
    document.getElementById(
      "password"
    ).value;

  const error =
    document.getElementById(
      "error"
    );

  error.textContent = "";


  if (!email || !password) {

    error.textContent =
      "Заполни все поля";

    return;
  }


  if (password.length < 4) {

    error.textContent =
      "Пароль должен быть минимум 4 символа";

    return;
  }


  const users = getUsers();


  /* РЕГИСТРАЦИЯ */

  if (mode === "register") {

    if (users[email]) {

      error.textContent =
        "Такой аккаунт уже существует";

      return;
    }


    users[email] = {

      email: email,

      password: password,

      profile: {

        nickname:
          email.split("@")[0],

        description: "",

        avatar: ""

      }

    };


    saveUsers(users);


    localStorage.setItem(
      "messengerCurrentUser",
      email
    );


    openMessenger();

    return;
  }


  /* ВХОД */

  if (!users[email]) {

    error.textContent =
      "Аккаунт не найден";

    return;
  }


  if (
    users[email].password !== password
  ) {

    error.textContent =
      "Неверный пароль";

    return;
  }


  localStorage.setItem(
    "messengerCurrentUser",
    email
  );


  openMessenger();
}


/* =========================
   ОТКРЫТЬ АККАУНТ
========================= */

function openMessenger() {

  const email = currentEmail();
  const users = getUsers();


  if (!email || !users[email]) {
    return;
  }


  document
    .getElementById("authScreen")
    .classList.add("hidden");


  document
    .getElementById("appScreen")
    .classList.remove("hidden");


  document.getElementById(
    "userEmail"
  ).textContent = email;


  loadProfile();

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


function loadProfile() {

  const email = currentEmail();
  const users = getUsers();


  if (!email || !users[email]) {
    return;
  }


  if (!users[email].profile) {

    users[email].profile = {

      nickname:
        email.split("@")[0],

      description: "",

      avatar: ""

    };

    saveUsers(users);
  }


  const profile =
    users[email].profile;


  document.getElementById(
    "profileNickname"
  ).textContent =
    profile.nickname ||
    email.split("@")[0];


  document.getElementById(
    "profileDescription"
  ).textContent =
    profile.description ||
    "Описание профиля";


  document.getElementById(
    "profileEmail"
  ).value = email;


  document.getElementById(
    "nickname"
  ).value =
    profile.nickname || "";


  document.getElementById(
    "description"
  ).value =
    profile.description || "";


  newAvatar =
    profile.avatar || "";


  showAvatar(newAvatar);
}


/* =========================
   АВАТАР
========================= */

function showAvatar(avatar) {

  const img =
    document.getElementById(
      "avatarPreview"
    );


  if (avatar) {

    img.src = avatar;

  } else {

    img.src =
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg"
             width="200"
             height="200">

          <rect
            width="100%"
            height="100%"
            fill="#20212a"/>

          <text
            x="50%"
            y="58%"
            text-anchor="middle"
            font-size="75">
            👤
          </text>

        </svg>
      `);
  }
}


function chooseAvatar() {

  document
    .getElementById("avatarInput")
    .click();
}


function changeAvatar(event) {

  const file =
    event.target.files[0];


  if (!file) {
    return;
  }


  if (!file.type.startsWith("image/")) {

    alert(
      "Можно выбрать только фотографию"
    );

    event.target.value = "";

    return;
  }


  const reader =
    new FileReader();


  reader.onload = function () {

    newAvatar =
      reader.result;

    showAvatar(newAvatar);

  };


  reader.readAsDataURL(file);
}


/* =========================
   ИЗМЕНИТЬ ПРОФИЛЬ
========================= */

function editProfile() {

  document
    .getElementById("editBox")
    .classList.remove("hidden");

  loadProfile();
}


function closeEdit() {

  document
    .getElementById("editBox")
    .classList.add("hidden");

  document.getElementById(
    "profileMessage"
  ).textContent = "";

  loadProfile();
}


/* =========================
   СОХРАНИТЬ
========================= */

function saveProfile() {

  const email = currentEmail();
  const users = getUsers();


  if (!email || !users[email]) {
    return;
  }


  const nickname =
    document
      .getElementById("nickname")
      .value
      .trim();


  const description =
    document
      .getElementById("description")
      .value
      .trim();


  const message =
    document.getElementById(
      "profileMessage"
    );


  if (!nickname) {

    message.textContent =
      "Введите никнейм";

    return;
  }


  users[email].profile = {

    nickname: nickname,

    description: description,

    avatar: newAvatar

  };


  saveUsers(users);


  document.getElementById(
    "profileNickname"
  ).textContent =
    nickname;


  document.getElementById(
    "profileDescription"
  ).textContent =
    description ||
    "Описание профиля";


  showAvatar(newAvatar);


  message.textContent =
    "✓ Профиль сохранён";


  setTimeout(function () {

    document
      .getElementById("editBox")
      .classList.add("hidden");

    message.textContent = "";

  }, 800);
}


/* =========================
   ВЫХОД
========================= */

function logout() {

  localStorage.removeItem(
    "messengerCurrentUser"
  );


  document
    .getElementById("appScreen")
    .classList.add("hidden");


  document
    .getElementById("authScreen")
    .classList.remove("hidden");


  document.getElementById(
    "email"
  ).value = "";


  document.getElementById(
    "password"
  ).value = "";


  setMode("login");
}


/* =========================
   АВТОВХОД
========================= */

window.addEventListener(
  "load",
  function () {

    const email =
      currentEmail();

    const users =
      getUsers();


    if (
      email &&
      users[email]
    ) {

      openMessenger();

    }

  }
);