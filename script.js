/* ==================================================
   MEOWL MESSENGER
   Локальная версия для GitHub Pages
================================================== */


/* ================= НАСТРОЙКИ ================= */

var USERS_KEY = "meowl_users";
var CURRENT_KEY = "meowl_current";
var SETTINGS_KEY = "meowl_settings";

var mode = "login";
var currentUser = null;
var selectedAvatar = "";


/* ================= ЭЛЕМЕНТЫ ================= */

var authScreen =
  document.getElementById("authScreen");

var appScreen =
  document.getElementById("appScreen");

var loginTab =
  document.getElementById("loginTab");

var registerTab =
  document.getElementById("registerTab");

var emailInput =
  document.getElementById("emailInput");

var passwordInput =
  document.getElementById("passwordInput");

var authButton =
  document.getElementById("authButton");

var authError =
  document.getElementById("authError");

var logoutButton =
  document.getElementById("logoutButton");

var chatsPage =
  document.getElementById("chatsPage");

var profilePage =
  document.getElementById("profilePage");

var settingsPage =
  document.getElementById("settingsPage");

var chatsButton =
  document.getElementById("chatsButton");

var settingsButton =
  document.getElementById("settingsButton");

var profileButton =
  document.getElementById("profileButton");

var pageTitle =
  document.getElementById("pageTitle");

var emailLabel =
  document.getElementById("emailLabel");

var profileNickname =
  document.getElementById("profileNickname");

var profileDescription =
  document.getElementById("profileDescription");

var avatarImage =
  document.getElementById("avatarImage");

var avatarDefault =
  document.getElementById("avatarDefault");

var editProfile =
  document.getElementById("editProfile");

var editProfileButton =
  document.getElementById("editProfileButton");

var photoButton =
  document.getElementById("photoButton");

var photoInput =
  document.getElementById("photoInput");

var nicknameInput =
  document.getElementById("nicknameInput");

var descriptionInput =
  document.getElementById("descriptionInput");

var profileEmail =
  document.getElementById("profileEmail");

var saveProfileButton =
  document.getElementById("saveProfileButton");

var cancelProfileButton =
  document.getElementById("cancelProfileButton");


/* ================= ПОЛЬЗОВАТЕЛИ ================= */

function getUsers() {

  var data =
    localStorage.getItem(USERS_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}


function saveUsers(users) {

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );

}


/* ================= ОШИБКА ================= */

function showAuthError(message) {

  authError.textContent = message;

}


/* ================= РЕЖИМ ВХОДА ================= */

loginTab.addEventListener(
  "click",
  function () {

    mode = "login";

    loginTab.classList.add("active");

    registerTab.classList.remove("active");

    authButton.textContent =
      "Продолжить";

    passwordInput.autocomplete =
      "current-password";

    showAuthError("");

  }
);


/* ================= РЕЖИМ РЕГИСТРАЦИИ ================= */

registerTab.addEventListener(
  "click",
  function () {

    mode = "register";

    registerTab.classList.add("active");

    loginTab.classList.remove("active");

    authButton.textContent =
      "Зарегистрироваться";

    passwordInput.autocomplete =
      "new-password";

    showAuthError("");

  }
);


/* ================= AUTH ================= */

authButton.addEventListener(
  "click",
  function () {

    var email =
      emailInput.value
        .trim()
        .toLowerCase();

    var password =
      passwordInput.value;

    showAuthError("");


    if (!email) {

      showAuthError(
        "Введите почту."
      );

      return;
    }


    if (!email.includes("@")) {

      showAuthError(
        "Введите правильную почту."
      );

      return;
    }


    if (password.length < 6) {

      showAuthError(
        "Пароль должен содержать минимум 6 символов."
      );

      return;
    }


    var users =
      getUsers();


    /* РЕГИСТРАЦИЯ */

    if (mode === "register") {

      var exists =
        users.some(
          function (user) {
            return user.email === email;
          }
        );


      if (exists) {

        showAuthError(
          "Пользователь с такой почтой уже существует."
        );

        return;
      }


      var user = {

        id:
          "user_" +
          Date.now() +
          "_" +
          Math.random()
            .toString(36)
            .substring(2, 9),

        email: email,

        password: password,

        nickname:
          email.split("@")[0],

        description:
          "Привет! Я использую Meowl Messenger 🐱",

        avatar: "",

        createdAt:
          Date.now()

      };


      users.push(user);

      saveUsers(users);

      currentUser = user;

      localStorage.setItem(
        CURRENT_KEY,
        user.id
      );

      openApp();

      return;
    }


    /* ВХОД */

    var foundUser =
      users.find(
        function (user) {

          return (
            user.email === email &&
            user.password === password
          );

        }
      );


    if (!foundUser) {

      showAuthError(
        "Неверная почта или пароль."
      );

      return;
    }


    currentUser =
      foundUser;


    localStorage.setItem(
      CURRENT_KEY,
      currentUser.id
    );


    openApp();

  }
);


/* ================= ENTER ================= */

emailInput.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Enter") {

      passwordInput.focus();

    }

  }
);


passwordInput.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Enter") {

      authButton.click();

    }

  }
);


/* ================= ОТКРЫТИЕ APP ================= */

function openApp() {

  authScreen.classList.add("hidden");

  appScreen.classList.remove("hidden");

  emailLabel.textContent =
    currentUser.email;

  updateProfile();

  loadSettings();

  showPage("chats");

}


/* ================= ПРОФИЛЬ ================= */

function updateProfile() {

  if (!currentUser) {
    return;
  }


  profileNickname.textContent =
    currentUser.nickname ||
    "Ник";


  profileDescription.textContent =
    currentUser.description ||
    "Описание профиля";


  profileEmail.value =
    currentUser.email;


  if (currentUser.avatar) {

    avatarImage.src =
      currentUser.avatar;

    avatarImage.style.display =
      "block";

    avatarDefault.style.display =
      "none";

  } else {

    avatarImage.style.display =
      "none";

    avatarDefault.style.display =
      "block";

  }

}


/* ================= ПОКАЗ СТРАНИЦЫ ================= */

function showPage(page) {

  chatsPage.classList.add("hidden");

  profilePage.classList.add("hidden");

  settingsPage.classList.add("hidden");

  chatsButton.classList.remove("active");

  profileButton.classList.remove("active");

  settingsButton.classList.remove("active");


  if (page === "chats") {

    chatsPage.classList.remove("hidden");

    chatsButton.classList.add("active");

    pageTitle.textContent =
      "Чаты";

  }


  if (page === "profile") {

    profilePage.classList.remove("hidden");

    profileButton.classList.add("active");

    pageTitle.textContent =
      "Профиль";

  }


  if (page === "settings") {

    settingsPage.classList.remove("hidden");

    settingsButton.classList.add("active");

    pageTitle.textContent =
      "Настройки";

  }

}


/* ================= NAV ================= */

chatsButton.addEventListener(
  "click",
  function () {

    showPage("chats");

  }
);


settingsButton.addEventListener(
  "click",
  function () {

    showPage("settings");

  }
);


profileButton.addEventListener(
  "click",
  function () {

    showPage("profile");

  }
);


/* ================= РЕДАКТИРОВАНИЕ ================= */

editProfileButton.addEventListener(
  "click",
  function () {

    nicknameInput.value =
      currentUser.nickname || "";

    descriptionInput.value =
      currentUser.description || "";

    profileEmail.value =
      currentUser.email;

    selectedAvatar =
      currentUser.avatar || "";

    editProfile.classList.remove(
      "hidden"
    );

  }
);


/* ================= ФОТО ================= */

photoButton.addEventListener(
  "click",
  function () {

    photoInput.click();

  }
);


photoInput.addEventListener(
  "change",
  function () {

    var file =
      photoInput.files[0];

    if (!file) {
      return;
    }


    if (!file.type.startsWith("image/")) {

      alert(
        "Выберите изображение."
      );

      return;
    }


    if (file.size > 5 * 1024 * 1024) {

      alert(
        "Фото должно быть меньше 5 МБ."
      );

      return;
    }


    var reader =
      new FileReader();


    reader.onload =
      function (event) {

        selectedAvatar =
          event.target.result;

      };


    reader.readAsDataURL(file);

  }
);


/* ================= СОХРАНЕНИЕ ПРОФИЛЯ ================= */

saveProfileButton.addEventListener(
  "click",
  function () {

    var nickname =
      nicknameInput.value.trim();

    var description =
      descriptionInput.value.trim();


    if (!nickname) {

      alert(
        "Введите ник."
      );

      return;
    }


    var users =
      getUsers();


    var index =
      users.findIndex(
        function (user) {

          return (
            user.id === currentUser.id
          );

        }
      );


    if (index === -1) {
      return;
    }


    users[index].nickname =
      nickname;

    users[index].description =
      description ||
      "Пока ничего не рассказал о себе.";

    users[index].avatar =
      selectedAvatar;


    currentUser =
      users[index];


    saveUsers(users);


    editProfile.classList.add(
      "hidden"
    );


    updateProfile();

    alert(
      "Профиль сохранён."
    );

  }
);


/* ================= ОТМЕНА ================= */

cancelProfileButton.addEventListener(
  "click",
  function () {

    editProfile.classList.add(
      "hidden"
    );

  }
);


/* ================= LOGOUT ================= */

logoutButton.addEventListener(
  "click",
  function () {

    localStorage.removeItem(
      CURRENT_KEY
    );

    currentUser = null;

    appScreen.classList.add(
      "hidden"
    );

    authScreen.classList.remove(
      "hidden"
    );

    emailInput.value = "";

    passwordInput.value = "";

    showAuthError("");

    mode = "login";

    loginTab.click();

  }
);


/* ==================================================
   НАСТРОЙКИ
================================================== */


/* ЭЛЕМЕНТЫ */

var darkThemeToggle =
  document.getElementById(
    "darkThemeToggle"
  );

var neonToggle =
  document.getElementById(
    "neonToggle"
  );

var enterSendToggle =
  document.getElementById(
    "enterSendToggle"
  );

var timeToggle =
  document.getElementById(
    "timeToggle"
  );

var previewToggle =
  document.getElementById(
    "previewToggle"
  );

var notificationsToggle =
  document.getElementById(
    "notificationsToggle"
  );

var soundToggle =
  document.getElementById(
    "soundToggle"
  );

var vibrationToggle =
  document.getElementById(
    "vibrationToggle"
  );

var onlineToggle =
  document.getElementById(
    "onlineToggle"
  );

var typingToggle =
  document.getElementById(
    "typingToggle"
  );

var readToggle =
  document.getElementById(
    "readToggle"
  );

var largeTextToggle =
  document.getElementById(
    "largeTextToggle"
  );

var reducedMotionToggle =
  document.getElementById(
    "reducedMotionToggle"
  );


/* ================= ПОЛУЧИТЬ НАСТРОЙКИ ================= */

function getSettings() {

  var data =
    localStorage.getItem(
      SETTINGS_KEY
    );

  if (!data) {

    return {

      darkTheme: true,
      neon: true,
      enterSend: true,
      time: true,
      preview: true,
      notifications: true,
      sound: true,
      vibration: true,
      online: true,
      typing: true,
      read: true,
      largeText: false,
      reducedMotion: false

    };

  }


  try {

    return JSON.parse(data);

  } catch (error) {

    return {};

  }

}


/* ================= СОХРАНИТЬ ================= */

function saveSettings() {

  var settings = {

    darkTheme:
      darkThemeToggle.checked,

    neon:
      neonToggle.checked,

    enterSend:
      enterSendToggle.checked,

    time:
      timeToggle.checked,

    preview:
      previewToggle.checked,

    notifications:
      notificationsToggle.checked,

    sound:
      soundToggle.checked,

    vibration:
      vibrationToggle.checked,

    online:
      onlineToggle.checked,

    typing:
      typingToggle.checked,

    read:
      readToggle.checked,

    largeText:
      largeTextToggle.checked,

    reducedMotion:
      reducedMotionToggle.checked

  };


  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(settings)
  );


  applySettings();

}


/* ================= ЗАГРУЗКА ================= */

function loadSettings() {

  var settings =
    getSettings();


  darkThemeToggle.checked =
    settings.darkTheme !== false;

  neonToggle.checked =
    settings.neon !== false;

  enterSendToggle.checked =
    settings.enterSend !== false;

  timeToggle.checked =
    settings.time !== false;

  previewToggle.checked =
    settings.preview !== false;

  notificationsToggle.checked =
    settings.notifications !== false;

  soundToggle.checked =
    settings.sound !== false;

  vibrationToggle.checked =
    settings.vibration !== false;

  onlineToggle.checked =
    settings.online !== false;

  typingToggle.checked =
    settings.typing !== false;

  readToggle.checked =
    settings.read !== false;

  largeTextToggle.checked =
    settings.largeText === true;

  reducedMotionToggle.checked =
    settings.reducedMotion === true;


  applySettings();

}


/* ================= ПРИМЕНЕНИЕ ================= */

function applySettings() {

  document.body.classList.toggle(
    "light",
    !darkThemeToggle.checked
  );


  document.body.classList.toggle(
    "no-neon",
    !neonToggle.checked
  );


  document.body.classList.toggle(
    "large-text",
    largeTextToggle.checked
  );


  document.body.classList.toggle(
    "reduced-motion",
    reducedMotionToggle.checked
  );

}


/* ================= СОХРАНЕНИЕ ПРИ ИЗМЕНЕНИИ ================= */

var allSettingsToggles = [

  darkThemeToggle,
  neonToggle,
  enterSendToggle,
  timeToggle,
  previewToggle,
  notificationsToggle,
  soundToggle,
  vibrationToggle,
  onlineToggle,
  typingToggle,
  readToggle,
  largeTextToggle,
  reducedMotionToggle

];


allSettingsToggles.forEach(
  function (toggle) {

    toggle.addEventListener(
      "change",
      saveSettings
    );

  }
);


/* ==================================================
   ЭКСПОРТ ДАННЫХ
================================================== */

var exportDataButton =
  document.getElementById(
    "exportDataButton"
  );


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
        [
          JSON.stringify(
            data,
            null,
            2
          )
        ],
        {
          type:
            "application/json"
        }
      );


    var url =
      URL.createObjectURL(blob);


    var link =
      document.createElement("a");


    link.href =
      url;

    link.download =
      "meowl-messenger-backup.json";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

  }
);


/* ==================================================
   ИМПОРТ
================================================== */

var importDataButton =
  document.getElementById(
    "importDataButton"
  );

var importDataInput =
  document.getElementById(
    "importDataInput"
  );


importDataButton.addEventListener(
  "click",
  function () {

    importDataInput.click();

  }
);


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
            "Данные успешно восстановлены!"
          );


          location.reload();

        } catch (error) {

          alert(
            "Ошибка: файл повреждён или имеет неправильный формат."
          );

        }

      };


    reader.readAsText(file);

  }
);


/* ==================================================
   ОЧИСТКА
================================================== */

var clearDataButton =
  document.getElementById(
    "clearDataButton"
  );


clearDataButton.addEventListener(
  "click",
  function () {

    var answer =
      confirm(
        "ВНИМАНИЕ!\n\nУдалить все локальные данные Meowl Messenger?"
      );


    if (!answer) {
      return;
    }


    localStorage.clear();


    alert(
      "Все локальные данные удалены."
    );


    location.reload();

  }
);


/* ==================================================
   НОВЫЙ ЧАТ
================================================== */

var newChatButton =
  document.getElementById(
    "newChatButton"
  );


newChatButton.addEventListener(
  "click",
  function () {

    alert(
      "Настоящие чаты между пользователями подключим следующим этапом."
    );

  }
);


/* ==================================================
   АВТОВХОД
================================================== */

function checkCurrentUser() {

  var currentId =
    localStorage.getItem(
      CURRENT_KEY
    );


  if (!currentId) {
    return;
  }


  var users =
    getUsers();


  var user =
    users.find(
      function (item) {

        return item.id === currentId;

      }
    );


  if (!user) {

    localStorage.removeItem(
      CURRENT_KEY
    );

    return;
  }


  currentUser =
    user;


  openApp();

}


/* ================= START ================= */

loadSettings();

checkCurrentUser();