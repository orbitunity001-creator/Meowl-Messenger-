let mode = "login";


/* ===== ПОЛЬЗОВАТЕЛИ ===== */

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


/* ===== ВХОД / РЕГИСТРАЦИЯ ===== */

function setMode(newMode) {

  mode = newMode;

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


/* ===== АВТОРИЗАЦИЯ ===== */

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


/* ===== ОТКРЫТЬ МЕССЕНДЖЕР ===== */

function openMessenger() {

  const email =
    localStorage.getItem(
      "messengerCurrentUser"
    );

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


/* ===== ЗАГРУЗКА ПРОФИЛЯ ===== */

function loadProfile() {

  const email =
    localStorage.getItem(
      "messengerCurrentUser"
    );

  const users = getUsers();


  if (!email || !users[email]) {
    return;
  }


  /* Если профиль старого пользователя отсутствует */

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


  /* Профиль */

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


  /* Поля редактирования */

  document.getElementById(
    "nickname"
  ).value =
    profile.nickname || "";


  document.getElementById(
    "description"
  ).value =
    profile.description || "";


  /* Почта */

  document.getElementById(
    "profileEmail"
  ).value = email;


  /* Аватар */

  setAvatar(profile.avatar);
}


/* ===== АВАТАР ===== */

function setAvatar(avatar) {

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
        >

          <rect
            width="100%"
            height="100%"
            fill="#20212a"
          />

          <text
            x="50%"
            y="55%"
            text-anchor="middle"
            font-size="80"
          >
            👤
          </text>

        </svg>
      `);
  }
}


/* ===== ВЫБОР ФОТО С УСТРОЙСТВА ===== */

document
  .getElementById("avatarInput")
  .addEventListener(
    "change",
    function () {

      const file =
        this.files[0];


      if (!file) {
        return;
      }


      if (
        !file.type.startsWith("image/")
      ) {

        alert(
          "Можно выбрать только фотографию"
        );

        this.value = "";

        return;
      }


      const reader =
        new FileReader();


      reader.onload =
        function(event) {

          setAvatar(
            event.target.result
          );

        };


      reader.readAsDataURL(file);
    }
  );


/* ===== ОТКРЫТЬ ИЗМЕНЕНИЕ ПРОФИЛЯ ===== */

function openEditProfile() {

  document
    .getElementById("editProfile")
    .classList.remove("hidden");


  loadProfile();
}


/* ===== ЗАКРЫТЬ ИЗМЕНЕНИЕ ===== */

function closeEditProfile() {

  document
    .getElementById("editProfile")
    .classList.add("hidden");


  document.getElementById(
    "profileMessage"
  ).textContent = "";


  loadProfile();
}


/* ===== СОХРАНИТЬ ПРОФИЛЬ ===== */

function saveProfile() {

  const email =
    localStorage.getItem(
      "messengerCurrentUser"
    );

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


  const avatar =
    document
      .getElementById("avatarPreview")
      .src;


  const message =
    document.getElementById(
      "profileMessage"
    );


  if (!nickname) {

    message.textContent =
      "Введите никнейм";

    return;
  }


  /* Сохраняем */

  users[email].profile = {

    nickname: nickname,

    description: description,

    avatar: avatar

  };


  saveUsers(users);


  /* Обновляем экран */

  loadProfile();


  message.textContent =
    "✓ Профиль сохранён";


  setTimeout(
    function() {

      closeEditProfile();

    },
    1000
  );
}


/* ===== ЧАТЫ ===== */

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
    .getElementById("chatsNav")
    .classList.add("active");


  document
    .getElementById("profileNav")
    .classList.remove("active");
}


/* ===== ПРОФИЛЬ ===== */

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
    .getElementById("chatsNav")
    .classList.remove("active");


  document
    .getElementById("profileNav")
    .classList.add("active");


  loadProfile();
}


/* ===== ВЫХОД ===== */

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


  document.getElementById(
    "error"
  ).textContent = "";


  closeEditProfile();

  setMode("login");
}


/* ===== АВТОМАТИЧЕСКИЙ ВХОД ===== */

window.addEventListener(
  "load",
  function() {

    const currentUser =
      localStorage.getItem(
        "messengerCurrentUser"
      );


    if (currentUser) {
      openMessenger();
    }

  }
);