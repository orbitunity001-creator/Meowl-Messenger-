let mode = "login";
let currentUser = null;
let newAvatar = "";

const USERS_KEY = "messengerUsers";
const CURRENT_KEY = "messengerCurrentUser";


function getUsers() {
  return JSON.parse(
    localStorage.getItem(USERS_KEY) || "[]"
  );
}


function saveUsers(users) {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
}


/* =========================
   ВХОД / РЕГИСТРАЦИЯ
========================= */

function setMode(value) {
  mode = value;

  document
    .getElementById("loginTab")
    .classList.toggle("active", value === "login");

  document
    .getElementById("registerTab")
    .classList.toggle("active", value === "register");

  document.getElementById("error").textContent = "";
}


function auth() {

  const email =
    document.getElementById("email")
      .value
      .trim()
      .toLowerCase();

  const password =
    document.getElementById("password").value;

  const error =
    document.getElementById("error");

  error.textContent = "";


  if (!email || !password) {
    error.textContent =
      "Заполни почту и пароль";
    return;
  }


  let users = getUsers();


  /* РЕГИСТРАЦИЯ */

  if (mode === "register") {

    if (
      users.some(user =>
        user.email === email
      )
    ) {
      error.textContent =
        "Такая почта уже зарегистрирована";
      return;
    }


    const user = {
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

    openMessenger();

    return;
  }


  /* ВХОД */

  const user =
    users.find(u =>
      u.email === email
    );


  if (!user || user.password !== password) {

    error.textContent =
      "Неверная почта или пароль";

    return;
  }


  currentUser = user;

  localStorage.setItem(
    CURRENT_KEY,
    email
  );

  openMessenger();
}


/* =========================
   ОТКРЫТЬ МЕССЕНДЖЕР
========================= */

function openMessenger() {

  document.getElementById("auth")
    .style.display = "none";

  document.getElementById("app")
    .style.display = "block";

  document.getElementById("userEmail")
    .textContent = currentUser.email;

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
    .getElementById("chatBtn")
    .classList.add("active");

  document
    .getElementById("profileBtn")
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
    .getElementById("chatBtn")
    .classList.remove("active");

  document
    .getElementById("profileBtn")
    .classList.add("active");


  loadProfile();
}


function loadProfile() {

  const profile =
    currentUser.profile || {};

  const nickname =
    profile.nickname || "Ник";

  const description =
    profile.description ||
    "Описание профиля";


  document.getElementById(
    "profileNick"
  ).textContent = nickname;


  document.getElementById(
    "profileDesc"
  ).textContent = description;


  document.getElementById(
    "profileEmail"
  ).value = currentUser.email;


  const image =
    document.getElementById("avatar");

  const placeholder =
    document.getElementById(
      "avatarPlaceholder"
    );


  if (profile.avatar) {

    image.src = profile.avatar;
    image.style.display = "block";

    placeholder.style.display =
      "none";

  } else {

    image.removeAttribute("src");
    image.style.display = "none";

    placeholder.style.display =
      "block";
  }
}


/* =========================
   РЕДАКТИРОВАНИЕ
========================= */

function openEdit() {

  const profile =
    currentUser.profile || {};


  document.getElementById(
    "nickname"
  ).value =
    profile.nickname || "";


  document.getElementById(
    "description"
  ).value =
    profile.description || "";


  document.getElementById(
    "profileEmail"
  ).value =
    currentUser.email;


  newAvatar =
    profile.avatar || "";


  document
    .getElementById("editBox")
    .classList.remove("hidden");
}


function closeEdit() {

  document
    .getElementById("editBox")
    .classList.add("hidden");

  newAvatar = "";

  document.getElementById(
    "avatarInput"
  ).value = "";
}


/* =========================
   ВЫБОР ФОТО
========================= */

function chooseAvatar() {
  document
    .getElementById("avatarInput")
    .click();
}


document
  .getElementById("avatarInput")
  .addEventListener(
    "change",
    function () {

      const file =
        this.files[0];

      if (!file) return;


      if (!file.type.startsWith("image/")) {

        alert(
          "Выбери изображение"
        );

        return;
      }


      const reader =
        new FileReader();


      reader.onload =
        function(event) {

          newAvatar =
            event.target.result;

        };


      reader.readAsDataURL(file);
    }
  );


/* =========================
   СОХРАНИТЬ ПРОФИЛЬ
========================= */

function saveProfile() {

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


  if (!nickname) {

    alert("Введи ник");

    return;
  }


  currentUser.profile = {

    nickname: nickname,

    description: description,

    avatar: newAvatar
  };


  const users = getUsers();


  const index =
    users.findIndex(
      user =>
        user.email ===
        currentUser.email
    );


  if (index !== -1) {

    users[index] =
      currentUser;

    saveUsers(users);
  }


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

  document.getElementById("app")
    .style.display = "none";

  document.getElementById("auth")
    .style.display = "block";


  document.getElementById(
    "email"
  ).value = "";

  document.getElementById(
    "password"
  ).value = "";

  document.getElementById(
    "error"
  ).textContent = "";


  setMode("login");
}


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


    if (!savedEmail) return;


    const users =
      getUsers();


    const user =
      users.find(
        u =>
          u.email === savedEmail
      );


    if (user) {

      currentUser = user;

      openMessenger();
    }
  }
);