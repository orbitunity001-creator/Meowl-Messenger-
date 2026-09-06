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

/* =========================
   НАСТРОЙКИ
========================= */

var settingsButton =
  document.getElementById("settingsButton");

var settingsPage =
  document.getElementById("settingsPage");

var darkThemeToggle =
  document.getElementById("darkThemeToggle");

var neonToggle =
  document.getElementById("neonToggle");

var soundToggle =
  document.getElementById("soundToggle");

var vibrationToggle =
  document.getElementById("vibrationToggle");

var timeToggle =
  document.getElementById("timeToggle");

var notificationsToggle =
  document.getElementById("notificationsToggle");

var onlineToggle =
  document.getElementById("onlineToggle");

var typingToggle =
  document.getElementById("typingToggle");


/* =========================
   ОТКРЫТИЕ НАСТРОЕК
========================= */

if (settingsButton) {

  settingsButton.addEventListener("click", function () {

    chatsPage.classList.add("hidden");
    profilePage.classList.add("hidden");
    settingsPage.classList.remove("hidden");

    chatsButton.classList.remove("active");
    profileButton.classList.remove("active");
    settingsButton.classList.add("active");

    pageTitle.textContent = "Настройки";

  });

}


/* =========================
   СОХРАНЕНИЕ НАСТРОЕК
========================= */

function saveSettings() {

  var settings = {

    darkTheme: darkThemeToggle.checked,
    neon: neonToggle.checked,
    sound: soundToggle.checked,
    vibration: vibrationToggle.checked,
    time: timeToggle.checked,
    notifications: notificationsToggle.checked,
    online: onlineToggle.checked,
    typing: typingToggle.checked

  };

  localStorage.setItem(
    "meowl_settings",
    JSON.stringify(settings)
  );

}


/* =========================
   ЗАГРУЗКА НАСТРОЕК
========================= */

function loadSettings() {

  var saved =
    localStorage.getItem("meowl_settings");

  if (!saved) {
    return;
  }

  try {

    var settings = JSON.parse(saved);

    darkThemeToggle.checked =
      settings.darkTheme !== false;

    neonToggle.checked =
      settings.neon !== false;

    soundToggle.checked =
      settings.sound !== false;

    vibrationToggle.checked =
      settings.vibration !== false;

    timeToggle.checked =
      settings.time !== false;

    notificationsToggle.checked =
      settings.notifications !== false;

    onlineToggle.checked =
      settings.online !== false;

    typingToggle.checked =
      settings.typing !== false;

  } catch (error) {

    console.log("Ошибка загрузки настроек");

  }

}


/* =========================
   СОХРАНЯЕМ ПРИ ИЗМЕНЕНИИ
========================= */

var settingsToggles = [

  darkThemeToggle,
  neonToggle,
  soundToggle,
  vibrationToggle,
  timeToggle,
  notificationsToggle,
  onlineToggle,
  typingToggle

];

settingsToggles.forEach(function (toggle) {

  if (toggle) {

    toggle.addEventListener(
      "change",
      saveSettings
    );

  }

});


/* =========================
   ЭКСПОРТ
========================= */

var exportDataButton =
  document.getElementById("exportDataButton");

if (exportDataButton) {

  exportDataButton.addEventListener(
    "click",
    function () {

      var data = {};

      for (
        var i = 0;
        i < localStorage.length;
        i++
      ) {

        var key =
          localStorage.key(i);

        data[key] =
          localStorage.getItem(key);

      }

      var blob =
        new Blob(
          [JSON.stringify(data, null, 2)],
          {
            type: "application/json"
          }
        );

      var url =
        URL.createObjectURL(blob);

      var link =
        document.createElement("a");

      link.href = url;
      link.download =
        "meowl-backup.json";

      link.click();

      URL.revokeObjectURL(url);

    }
  );

}


/* =========================
   ИМПОРТ
========================= */

var importDataButton =
  document.getElementById("importDataButton");

var importDataInput =
  document.getElementById("importDataInput");

if (importDataButton) {

  importDataButton.addEventListener(
    "click",
    function () {

      importDataInput.click();

    }
  );

}

if (importDataInput) {

  importDataInput.addEventListener(
    "change",
    function () {

      var file =
        importDataInput.files[0];

      if (!file) {
        return;
      }

      var reader =
        new FileReader();

      reader.onload =
        function (event) {

          try {

            var data =
              JSON.parse(
                event.target.result
              );

            Object.keys(data).forEach(
              function (key) {

                localStorage.setItem(
                  key,
                  data[key]
                );

              }
            );

            alert(
              "Данные успешно импортированы!"
            );

            location.reload();

          } catch (error) {

            alert(
              "Не удалось импортировать файл."
            );

          }

        };

      reader.readAsText(file);

    }
  );

}


/* =========================
   ОЧИСТКА ДАННЫХ
========================= */

var clearDataButton =
  document.getElementById("clearDataButton");

if (clearDataButton) {

  clearDataButton.addEventListener(
    "click",
    function () {

      var answer =
        confirm(
          "Удалить все локальные данные Meowl Messenger?"
        );

      if (!answer) {
        return;
      }

      localStorage.clear();

      alert(
        "Локальные данные удалены."
      );

      location.reload();

    }
  );

}


/* =========================
   ЗАГРУЗИТЬ НАСТРОЙКИ
========================= */

loadSettings();