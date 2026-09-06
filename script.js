/* =========================================
   MEOWL MESSENGER
   Без Firebase
========================================= */


/* =========================================
   STORAGE
========================================= */

const USERS_KEY = "meowl_users";
const CURRENT_USER_KEY = "meowl_current_user";
const FAVORITES_KEY = "meowl_favorites";


/* =========================================
   HELPERS
========================================= */

function getUsers() {
  try {
    return JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );
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

function getCurrentUser() {
  try {
    return JSON.parse(
      localStorage.getItem(CURRENT_USER_KEY)
    );
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(user)
  );
}

function removeCurrentUser() {
  localStorage.removeItem(
    CURRENT_USER_KEY
  );
}

function getFavorites() {
  try {
    return JSON.parse(
      localStorage.getItem(FAVORITES_KEY) || "[]"
    );
  } catch {
    return [];
  }
}

function saveFavorites(messages) {
  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(messages)
  );
}

function getTime() {
  return new Date().toLocaleTimeString(
    "ru-RU",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}


/* =========================================
   ELEMENTS
========================================= */

const authScreen =
  document.getElementById("authScreen");

const appScreen =
  document.getElementById("appScreen");

const favoritesScreen =
  document.getElementById("favoritesScreen");


/* AUTH */

const loginTab =
  document.getElementById("loginTab");

const registerTab =
  document.getElementById("registerTab");

const authForm =
  document.getElementById("authForm");

const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const authButton =
  document.getElementById("authButton");

const authMessage =
  document.getElementById("authMessage");


/* NAV */

const chatsPage =
  document.getElementById("chatsPage");

const profilePage =
  document.getElementById("profilePage");

const chatsNav =
  document.getElementById("chatsNav");

const profileNav =
  document.getElementById("profileNav");

const logoutButton =
  document.getElementById("logoutButton");


/* PROFILE */

const profileAvatar =
  document.getElementById("profileAvatar");

const avatarInput =
  document.getElementById("avatarInput");

const nicknameInput =
  document.getElementById("nickname");

const descriptionInput =
  document.getElementById("description");

const profileEmail =
  document.getElementById("profileEmail");

const saveProfile =
  document.getElementById("saveProfile");


/* FAVORITES */

const favoritesOpen =
  document.getElementById("favoritesOpen");

const favoritesBack =
  document.getElementById("favoritesBack");

const favoritesMessages =
  document.getElementById("favoritesMessages");

const favoritesForm =
  document.getElementById("favoritesForm");

const favoritesInput =
  document.getElementById("favoritesInput");

const favoritesPreview =
  document.getElementById("favoritesPreview");

const attachButton =
  document.getElementById("attachButton");

const attachMenu =
  document.getElementById("attachMenu");

const photoButton =
  document.getElementById("photoButton");

const videoButton =
  document.getElementById("videoButton");

const photoInput =
  document.getElementById("photoInput");

const videoInput =
  document.getElementById("videoInput");

const clearFavorites =
  document.getElementById("clearFavorites");


/* =========================================
   AUTH MODE
========================================= */

let isRegisterMode = false;


function setAuthMode(register) {

  isRegisterMode = register;

  authMessage.textContent = "";

  if (register) {

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    authButton.textContent =
      "Зарегистрироваться";

  } else {

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    authButton.textContent =
      "Продолжить";
  }
}


loginTab.addEventListener(
  "click",
  () => setAuthMode(false)
);

registerTab.addEventListener(
  "click",
  () => setAuthMode(true)
);


/* =========================================
   AUTH
========================================= */

authForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    const email =
      emailInput.value.trim().toLowerCase();

    const password =
      passwordInput.value;

    authMessage.textContent = "";

    if (!email || !password) {
      authMessage.textContent =
        "Заполни все поля.";
      return;
    }


    const users = getUsers();


    /* REGISTER */

    if (isRegisterMode) {

      const exists =
        users.some(
          user => user.email === email
        );

      if (exists) {

        authMessage.textContent =
          "Этот email уже зарегистрирован.";

        return;
      }


      const user = {

        id:
          Date.now().toString(),

        email: email,

        password: password,

        nickname:
          email.split("@")[0],

        description: "",

        avatar: ""
      };


      users.push(user);

      saveUsers(users);

      saveCurrentUser(user);

      showApp();

      return;
    }


    /* LOGIN */

    const user =
      users.find(
        item =>
          item.email === email &&
          item.password === password
      );


    if (!user) {

      authMessage.textContent =
        "Неверный email или пароль.";

      return;
    }


    saveCurrentUser(user);

    showApp();

  }
);


/* =========================================
   SHOW APP
========================================= */

function showApp() {

  authScreen.classList.add("hidden");

  favoritesScreen.classList.add("hidden");

  appScreen.classList.remove("hidden");

  showChats();

  loadProfile();

  renderFavorites();
}


/* =========================================
   CHATS / PROFILE
========================================= */

function showChats() {

  chatsPage.classList.remove("hidden");

  profilePage.classList.add("hidden");

  chatsNav.classList.add("active");

  profileNav.classList.remove("active");
}


function showProfile() {

  chatsPage.classList.add("hidden");

  profilePage.classList.remove("hidden");

  chatsNav.classList.remove("active");

  profileNav.classList.add("active");

  loadProfile();
}


chatsNav.addEventListener(
  "click",
  showChats
);

profileNav.addEventListener(
  "click",
  showProfile
);


/* =========================================
   LOGOUT
========================================= */

logoutButton.addEventListener(
  "click",
  function() {

    removeCurrentUser();

    appScreen.classList.add("hidden");

    favoritesScreen.classList.add("hidden");

    authScreen.classList.remove("hidden");

    emailInput.value = "";
    passwordInput.value = "";

    setAuthMode(false);
  }
);


/* =========================================
   PROFILE
========================================= */

function loadProfile() {

  const user =
    getCurrentUser();

  if (!user) return;

  nicknameInput.value =
    user.nickname || "";

  descriptionInput.value =
    user.description || "";

  profileEmail.value =
    user.email || "";


  if (user.avatar) {

    profileAvatar.innerHTML = "";

    const image =
      document.createElement("img");

    image.src = user.avatar;

    image.alt = "Аватар";

    profileAvatar.appendChild(image);

  } else {

    profileAvatar.textContent = "🐱";
  }
}


/* AVATAR */

avatarInput.addEventListener(
  "change",
  function() {

    const file =
      avatarInput.files[0];

    if (!file) return;


    if (!file.type.startsWith("image/")) {

      alert(
        "Можно выбрать только изображение."
      );

      return;
    }


    if (file.size > 4 * 1024 * 1024) {

      alert(
        "Аватар слишком большой. Максимум 4 МБ."
      );

      return;
    }


    const reader =
      new FileReader();


    reader.onload = function() {

      const user =
        getCurrentUser();

      if (!user) return;

      user.avatar =
        reader.result;

      saveCurrentUser(user);

      const users =
        getUsers();

      const index =
        users.findIndex(
          item =>
            item.id === user.id
        );

      if (index !== -1) {

        users[index] =
          user;

        saveUsers(users);
      }

      loadProfile();
    };


    reader.readAsDataURL(file);
  }
);


/* SAVE PROFILE */

saveProfile.addEventListener(
  "click",
  function() {

    const user =
      getCurrentUser();

    if (!user) return;


    user.nickname =
      nicknameInput.value.trim() ||
      user.email.split("@")[0];

    user.description =
      descriptionInput.value.trim();


    saveCurrentUser(user);


    const users =
      getUsers();

    const index =
      users.findIndex(
        item =>
          item.id === user.id
      );


    if (index !== -1) {

      users[index] =
        user;

      saveUsers(users);
    }


    alert("Профиль сохранён.");
  }
);


/* =========================================
   FAVORITES — OPEN
========================================= */

favoritesOpen.addEventListener(
  "click",
  function() {

    appScreen.classList.add("hidden");

    favoritesScreen.classList.remove("hidden");

    attachMenu.classList.add("hidden");

    renderFavorites();

    setTimeout(
      () => favoritesInput.focus(),
      100
    );
  }
);


/* =========================================
   FAVORITES — BACK
========================================= */

favoritesBack.addEventListener(
  "click",
  function() {

    favoritesScreen.classList.add("hidden");

    appScreen.classList.remove("hidden");

    showChats();
  }
);


/* =========================================
   FAVORITES — RENDER
========================================= */

function renderFavorites() {

  const messages =
    getFavorites();


  favoritesMessages.innerHTML = "";


  if (messages.length === 0) {

    const empty =
      document.createElement("div");

    empty.className =
      "favorites-empty";


    const big =
      document.createElement("span");

    big.className = "big";

    big.textContent = "⭐";


    const title =
      document.createElement("strong");

    title.textContent =
      "Избранное";


    const text =
      document.createElement("div");

    text.textContent =
      "Сохраняй здесь сообщения, фото и видео";


    empty.appendChild(big);

    empty.appendChild(title);

    empty.appendChild(text);

    favoritesMessages.appendChild(empty);


    favoritesPreview.textContent =
      "Чат с самим собой";

    return;
  }


  messages.forEach(
    message => {

      const element =
        document.createElement("div");

      element.className =
        "message";


      /* TEXT */

      if (message.type === "text") {

        const text =
          document.createElement("div");

        text.className =
          "message-text";

        text.textContent =
          message.text;

        element.appendChild(text);
      }


      /* IMAGE */

      if (message.type === "image") {

        const image =
          document.createElement("img");

        image.className =
          "message-image";

        image.src =
          message.data;

        image.alt =
          "Фото";

        element.appendChild(image);
      }


      /* VIDEO */

      if (message.type === "video") {

        const video =
          document.createElement("video");

        video.className =
          "message-video";

        video.src =
          message.data;

        video.controls = true;

        video.preload =
          "metadata";

        element.appendChild(video);
      }


      /* TIME */

      const time =
        document.createElement("span");

      time.className =
        "message-time";

      time.textContent =
        message.time;

      element.appendChild(time);


      favoritesMessages.appendChild(
        element
      );
    }
  );


  const last =
    messages[messages.length - 1];


  if (last.type === "text") {

    favoritesPreview.textContent =
      last.text;

  } else if (last.type === "image") {

    favoritesPreview.textContent =
      "🖼️ Фото";

  } else if (last.type === "video") {

    favoritesPreview.textContent =
      "🎥 Видео";
  }


  requestAnimationFrame(
    () => {

      favoritesMessages.scrollTop =
        favoritesMessages.scrollHeight;

    }
  );
}


/* =========================================
   SEND TEXT
========================================= */

favoritesForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const text =
      favoritesInput.value.trim();


    if (!text) return;


    const messages =
      getFavorites();


    messages.push({

      id:
        Date.now() +
        Math.random(),

      type:
        "text",

      text:
        text,

      time:
        getTime()
    });


    try {

      saveFavorites(messages);

    } catch {

      alert(
        "Не удалось сохранить сообщение."
      );

      return;
    }


    favoritesInput.value = "";

    renderFavorites();
  }
);


/* =========================================
   ATTACH MENU
========================================= */

attachButton.addEventListener(
  "click",
  function() {

    attachMenu.classList.toggle(
      "hidden"
    );
  }
);


/* =========================================
   PHOTO
========================================= */

photoButton.addEventListener(
  "click",
  function() {

    photoInput.click();

    attachMenu.classList.add(
      "hidden"
    );
  }
);


photoInput.addEventListener(
  "change",
  function() {

    const file =
      photoInput.files[0];

    if (!file) return;


    if (!file.type.startsWith("image/")) {

      alert(
        "Выбери изображение."
      );

      return;
    }


    /*
      Ограничиваем размер,
      потому что файл хранится
      локально в браузере.
    */

    if (file.size > 4 * 1024 * 1024) {

      alert(
        "Фото слишком большое. Максимум 4 МБ."
      );

      photoInput.value = "";

      return;
    }


    readFile(
      file,
      "image"
    );

    photoInput.value = "";
  }
);


/* =========================================
   VIDEO
========================================= */

videoButton.addEventListener(
  "click",
  function() {

    videoInput.click();

    attachMenu.classList.add(
      "hidden"
    );
  }
);


videoInput.addEventListener(
  "change",
  function() {

    const file =
      videoInput.files[0];

    if (!file) return;


    if (!file.type.startsWith("video/")) {

      alert(
        "Выбери видео."
      );

      return;
    }


    if (file.size > 6 * 1024 * 1024) {

      alert(
        "Видео слишком большое. Максимум 6 МБ."
      );

      videoInput.value = "";

      return;
    }


    readFile(
      file,
      "video"
    );

    videoInput.value = "";
  }
);


/* =========================================
   READ FILE
========================================= */

function readFile(
  file,
  type
) {

  const reader =
    new FileReader();


  reader.onload =
    function() {

      const messages =
        getFavorites();


      messages.push({

        id:
          Date.now() +
          Math.random(),

        type:
          type,

        data:
          reader.result,

        name:
          file.name,

        time:
          getTime()
      });


      try {

        saveFavorites(
          messages
        );

        renderFavorites();

      } catch {

        alert(
          "Не удалось сохранить файл. " +
          "Возможно, в браузере закончилась свободная память."
        );
      }
    };


  reader.onerror =
    function() {

      alert(
        "Не удалось прочитать файл."
      );
    };


  reader.readAsDataURL(file);
}


/* =========================================
   CLEAR FAVORITES
========================================= */

clearFavorites.addEventListener(
  "click",
  function() {

    const messages =
      getFavorites();


    if (messages.length === 0) {
      return;
    }


    const answer =
      confirm(
        "Удалить все сообщения из «Избранного»?"
      );


    if (!answer) return;


    localStorage.removeItem(
      FAVORITES_KEY
    );


    renderFavorites();
  }
);


/* =========================================
   START
========================================= */

const currentUser =
  getCurrentUser();


if (currentUser) {

  showApp();

} else {

  authScreen.classList.remove(
    "hidden"
  );

  appScreen.classList.add(
    "hidden"
  );

  favoritesScreen.classList.add(
    "hidden"
  );
}