/* =========================================
   MEOWL MESSENGER
   LOCAL VERSION
========================================= */

const USERS_KEY = "meowl_users_v2";
const CURRENT_USER_KEY = "meowl_current_user_v2";
const FAVORITES_KEY = "meowl_favorites_v2";


/* =========================================
   STORAGE
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
      localStorage.getItem(
        CURRENT_USER_KEY
      )
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


function logoutUser() {

  localStorage.removeItem(
    CURRENT_USER_KEY
  );
}


function getFavorites() {

  try {

    return JSON.parse(
      localStorage.getItem(
        FAVORITES_KEY
      ) || "[]"
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


function timeNow() {

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
  document.getElementById(
    "authScreen"
  );

const appScreen =
  document.getElementById(
    "appScreen"
  );

const favoritesScreen =
  document.getElementById(
    "favoritesScreen"
  );


/* AUTH */

const loginTab =
  document.getElementById(
    "loginTab"
  );

const registerTab =
  document.getElementById(
    "registerTab"
  );

const authForm =
  document.getElementById(
    "authForm"
  );

const email =
  document.getElementById(
    "email"
  );

const password =
  document.getElementById(
    "password"
  );

const authButton =
  document.getElementById(
    "authButton"
  );

const authError =
  document.getElementById(
    "authError"
  );


/* PAGES */

const chatsPage =
  document.getElementById(
    "chatsPage"
  );

const profilePage =
  document.getElementById(
    "profilePage"
  );


/* NAV */

const chatsNav =
  document.getElementById(
    "chatsNav"
  );

const profileNav =
  document.getElementById(
    "profileNav"
  );

const logoutButton =
  document.getElementById(
    "logoutButton"
  );


/* PROFILE */

const avatarInput =
  document.getElementById(
    "avatarInput"
  );

const profileAvatar =
  document.getElementById(
    "profileAvatar"
  );

const nicknameInput =
  document.getElementById(
    "nicknameInput"
  );

const descriptionInput =
  document.getElementById(
    "descriptionInput"
  );

const profileEmail =
  document.getElementById(
    "profileEmail"
  );

const saveProfileButton =
  document.getElementById(
    "saveProfileButton"
  );

const profileSaved =
  document.getElementById(
    "profileSaved"
  );


/* FAVORITES */

const favoritesButton =
  document.getElementById(
    "favoritesButton"
  );

const favoritesBack =
  document.getElementById(
    "favoritesBack"
  );

const favoritesMessages =
  document.getElementById(
    "favoritesMessages"
  );

const favoritesPreview =
  document.getElementById(
    "favoritesPreview"
  );

const messageForm =
  document.getElementById(
    "messageForm"
  );

const messageInput =
  document.getElementById(
    "messageInput"
  );

const attachButton =
  document.getElementById(
    "attachButton"
  );

const attachMenu =
  document.getElementById(
    "attachMenu"
  );

const choosePhoto =
  document.getElementById(
    "choosePhoto"
  );

const chooseVideo =
  document.getElementById(
    "chooseVideo"
  );

const photoInput =
  document.getElementById(
    "photoInput"
  );

const videoInput =
  document.getElementById(
    "videoInput"
  );

const clearFavorites =
  document.getElementById(
    "clearFavorites"
  );


/* =========================================
   AUTH MODE
========================================= */

let registerMode = false;


function setLoginMode() {

  registerMode = false;

  loginTab.classList.add(
    "active"
  );

  registerTab.classList.remove(
    "active"
  );

  authButton.textContent =
    "Продолжить";

  authError.textContent = "";
}


function setRegisterMode() {

  registerMode = true;

  registerTab.classList.add(
    "active"
  );

  loginTab.classList.remove(
    "active"
  );

  authButton.textContent =
    "Зарегистрироваться";

  authError.textContent = "";
}


loginTab.addEventListener(
  "click",
  setLoginMode
);


registerTab.addEventListener(
  "click",
  setRegisterMode
);


/* =========================================
   LOGIN / REGISTER
========================================= */

authForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    authError.textContent = "";

    const userEmail =
      email.value
        .trim()
        .toLowerCase();

    const userPassword =
      password.value;


    if (!userEmail ||
        !userPassword) {

      authError.textContent =
        "Заполни все поля.";

      return;
    }


    const users =
      getUsers();


    /* REGISTER */

    if (registerMode) {

      const existing =
        users.find(
          user =>
            user.email === userEmail
        );


      if (existing) {

        authError.textContent =
          "Такой аккаунт уже существует.";

        return;
      }


      const newUser = {

        id:
          Date.now().toString(),

        email:
          userEmail,

        password:
          userPassword,

        nickname:
          userEmail.split("@")[0],

        description:
          "",

        avatar:
          ""
      };


      users.push(newUser);

      saveUsers(users);

      saveCurrentUser(
        newUser
      );

      openApp();

      return;
    }


    /* LOGIN */

    const user =
      users.find(
        item =>
          item.email === userEmail &&
          item.password === userPassword
      );


    if (!user) {

      authError.textContent =
        "Неверный email или пароль.";

      return;
    }


    saveCurrentUser(user);

    openApp();
  }
);


/* =========================================
   OPEN APP
========================================= */

function openApp() {

  authScreen.classList.add(
    "hidden"
  );

  favoritesScreen.classList.add(
    "hidden"
  );

  appScreen.classList.remove(
    "hidden"
  );

  openChats();

  loadProfile();

  renderFavorites();
}


/* =========================================
   CHATS
========================================= */

function openChats() {

  chatsPage.classList.remove(
    "hidden"
  );

  profilePage.classList.add(
    "hidden"
  );

  chatsNav.classList.add(
    "active"
  );

  profileNav.classList.remove(
    "active"
  );
}


chatsNav.addEventListener(
  "click",
  openChats
);


/* =========================================
   PROFILE PAGE
========================================= */

function openProfile() {

  chatsPage.classList.add(
    "hidden"
  );

  profilePage.classList.remove(
    "hidden"
  );

  chatsNav.classList.remove(
    "active"
  );

  profileNav.classList.add(
    "active"
  );

  loadProfile();
}


profileNav.addEventListener(
  "click",
  openProfile
);


/* =========================================
   LOGOUT
========================================= */

logoutButton.addEventListener(
  "click",
  function() {

    logoutUser();

    appScreen.classList.add(
      "hidden"
    );

    favoritesScreen.classList.add(
      "hidden"
    );

    authScreen.classList.remove(
      "hidden"
    );

    email.value = "";
    password.value = "";

    setLoginMode();
  }
);


/* =========================================
   PROFILE LOAD
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

    const img =
      document.createElement(
        "img"
      );

    img.src =
      user.avatar;

    img.alt =
      "Аватар";

    profileAvatar.appendChild(
      img
    );

  } else {

    profileAvatar.textContent =
      "🐱";
  }
}


/* =========================================
   CHANGE AVATAR
========================================= */

avatarInput.addEventListener(
  "change",
  function() {

    const file =
      avatarInput.files[0];

    if (!file) return;


    if (!file.type.startsWith("image/")) {

      alert(
        "Выбери изображение."
      );

      return;
    }


    if (file.size >
        4 * 1024 * 1024) {

      alert(
        "Максимальный размер аватара — 4 МБ."
      );

      avatarInput.value = "";

      return;
    }


    const reader =
      new FileReader();


    reader.onload =
      function() {

        const user =
          getCurrentUser();

        if (!user) return;


        user.avatar =
          reader.result;


        saveCurrentUser(
          user
        );


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


    reader.onerror =
      function() {

        alert(
          "Не удалось загрузить аватар."
        );
      };


    reader.readAsDataURL(file);
  }
);


/* =========================================
   SAVE PROFILE
========================================= */

saveProfileButton.addEventListener(
  "click",
  function() {

    const user =
      getCurrentUser();

    if (!user) return;


    const nickname =
      nicknameInput.value.trim();


    user.nickname =
      nickname ||
      user.email.split("@")[0];


    user.description =
      descriptionInput.value.trim();


    saveCurrentUser(
      user
    );


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


    profileSaved.textContent =
      "✓ Профиль сохранён";


    setTimeout(
      function() {

        profileSaved.textContent =
          "";

      },
      2500
    );
  }
);


/* =========================================
   OPEN FAVORITES
========================================= */

favoritesButton.addEventListener(
  "click",
  function() {

    appScreen.classList.add(
      "hidden"
    );

    favoritesScreen.classList.remove(
      "hidden"
    );

    attachMenu.classList.add(
      "hidden"
    );

    renderFavorites();

    setTimeout(
      function() {

        messageInput.focus();

      },
      100
    );
  }
);


/* =========================================
   CLOSE FAVORITES
========================================= */

favoritesBack.addEventListener(
  "click",
  function() {

    favoritesScreen.classList.add(
      "hidden"
    );

    appScreen.classList.remove(
      "hidden"
    );

    openChats();
  }
);


/* =========================================
   RENDER FAVORITES
========================================= */

function renderFavorites() {

  const messages =
    getFavorites();


  favoritesMessages.innerHTML =
    "";


  if (!messages.length) {

    const empty =
      document.createElement(
        "div"
      );

    empty.className =
      "empty-favorites";


    const star =
      document.createElement(
        "span"
      );

    star.className =
      "empty-star";

    star.textContent =
      "⭐";


    const title =
      document.createElement(
        "strong"
      );

    title.textContent =
      "Избранное";


    const text =
      document.createElement(
        "div"
      );

    text.textContent =
      "Сохраняй здесь сообщения, фото и видео";


    empty.appendChild(
      star
    );

    empty.appendChild(
      title
    );

    empty.appendChild(
      text
    );


    favoritesMessages.appendChild(
      empty
    );


    favoritesPreview.textContent =
      "Чат с самим собой";


    return;
  }


  messages.forEach(
    function(message) {

      const bubble =
        document.createElement(
          "div"
        );

      bubble.className =
        "message";


      if (message.type === "text") {

        const text =
          document.createElement(
            "div"
          );

        text.className =
          "message-text";

        text.textContent =
          message.text;

        bubble.appendChild(
          text
        );
      }


      if (message.type === "image") {

        const img =
          document.createElement(
            "img"
          );

        img.className =
          "message-image";

        img.src =
          message.data;

        img.alt =
          "Фото";

        bubble.appendChild(
          img
        );
      }


      if (message.type === "video") {

        const video =
          document.createElement(
            "video"
          );

        video.className =
          "message-video";

        video.src =
          message.data;

        video.controls =
          true;

        video.preload =
          "metadata";

        bubble.appendChild(
          video
        );
      }


      const time =
        document.createElement(
          "span"
        );

      time.className =
        "message-time";

      time.textContent =
        message.time;


      bubble.appendChild(
        time
      );


      favoritesMessages.appendChild(
        bubble
      );
    }
  );


  const last =
    messages[
      messages.length - 1
    ];


  if (last.type === "text") {

    favoritesPreview.textContent =
      last.text;

  } else if (
    last.type === "image"
  ) {

    favoritesPreview.textContent =
      "🖼️ Фото";

  } else {

    favoritesPreview.textContent =
      "🎥 Видео";
  }


  favoritesMessages.scrollTop =
    favoritesMessages.scrollHeight;
}


/* =========================================
   SEND MESSAGE
========================================= */

messageForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const text =
      messageInput.value.trim();


    if (!text) return;


    const messages =
      getFavorites();


    messages.push({

      id:
        Date.now(),

      type:
        "text",

      text:
        text,

      time:
        timeNow()
    });


    try {

      saveFavorites(
        messages
      );

    } catch {

      alert(
        "Не удалось сохранить сообщение."
      );

      return;
    }


    messageInput.value =
      "";


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

choosePhoto.addEventListener(
  "click",
  function() {

    attachMenu.classList.add(
      "hidden"
    );

    photoInput.click();
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
        "Выбери фотографию."
      );

      return;
    }


    if (file.size >
        4 * 1024 * 1024) {

      alert(
        "Фото должно быть меньше 4 МБ."
      );

      photoInput.value = "";

      return;
    }


    readMedia(
      file,
      "image"
    );

    photoInput.value = "";
  }
);


/* =========================================
   VIDEO
========================================= */

chooseVideo.addEventListener(
  "click",
  function() {

    attachMenu.classList.add(
      "hidden"
    );

    videoInput.click();
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


    if (file.size >
        6 * 1024 * 1024) {

      alert(
        "Видео должно быть меньше 6 МБ."
      );

      videoInput.value = "";

      return;
    }


    readMedia(
      file,
      "video"
    );

    videoInput.value = "";
  }
);


/* =========================================
   READ MEDIA
========================================= */

function readMedia(
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
          Date.now(),

        type:
          type,

        data:
          reader.result,

        name:
          file.name,

        time:
          timeNow()
      });


      try {

        saveFavorites(
          messages
        );

        renderFavorites();

      } catch {

        alert(
          "Не удалось сохранить файл."
        );
      }
    };


  reader.onerror =
    function() {

      alert(
        "Ошибка чтения файла."
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


    if (!messages.length) {
      return;
    }


    if (
      !confirm(
        "Удалить всё из «Избранного»?"
      )
    ) {

      return;
    }


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

  openApp();

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