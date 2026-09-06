document.addEventListener("DOMContentLoaded", function () {

  let mode = "login";
  let selectedAvatar = "";


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
    document.getElementById("email");

  const passwordInput =
    document.getElementById("password");

  const error =
    document.getElementById("error");

  const chatsPage =
    document.getElementById("chatsPage");

  const profilePage =
    document.getElementById("profilePage");

  const chatsNav =
    document.getElementById("chatsNav");

  const profileNav =
    document.getElementById("profileNav");

  const pageTitle =
    document.getElementById("pageTitle");

  const userEmail =
    document.getElementById("userEmail");

  const logoutButton =
    document.getElementById("logoutButton");

  const avatarPreview =
    document.getElementById("avatarPreview");

  const profileNickname =
    document.getElementById("profileNickname");

  const profileDescription =
    document.getElementById("profileDescription");

  const editProfile =
    document.getElementById("editProfile");

  const editProfileButton =
    document.getElementById("editProfileButton");

  const avatarButton =
    document.getElementById("avatarButton");

  const avatarInput =
    document.getElementById("avatarInput");

  const nicknameInput =
    document.getElementById("nickname");

  const descriptionInput =
    document.getElementById("description");

  const profileEmail =
    document.getElementById("profileEmail");

  const saveProfileButton =
    document.getElementById("saveProfileButton");

  const cancelProfileButton =
    document.getElementById("cancelProfileButton");

  const profileMessage =
    document.getElementById("profileMessage");


  /* =========================
     LOCAL STORAGE
  ========================= */

  function getUsers() {

    try {

      return JSON.parse(
        localStorage.getItem("messengerUsers") || "{}"
      );

    } catch {

      return {};

    }
  }


  function saveUsers(users) {

    localStorage.setItem(
      "messengerUsers",
      JSON.stringify(users)
    );

  }


  function getCurrentUser() {

    return localStorage.getItem(
      "messengerCurrentUser"
    );

  }


  /* =========================
     ВХОД / РЕГИСТРАЦИЯ
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
        : "Создать аккаунт";

    error.textContent = "";

  }


  loginTab.addEventListener(
    "click",
    function () {
      setMode("login");
    }
  );


  registerTab.addEventListener(
    "click",
    function () {
      setMode("register");
    }
  );


  authButton.addEventListener(
    "click",
    function () {

      const email =
        emailInput.value
          .trim()
          .toLowerCase();

      const password =
        passwordInput.value;

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
  );


  /* =========================
     ОТКРЫТЬ МЕССЕНДЖЕР
  ========================= */

  function openMessenger() {

    const email =
      getCurrentUser();

    const users =
      getUsers();


    if (!email || !users[email]) {

      return;
    }


    authScreen.classList.add(
      "hidden"
    );

    appScreen.classList.remove(
      "hidden"
    );


    userEmail.textContent =
      email;


    loadProfile();

    showChats();

  }


  /* =========================
     ПРОФИЛЬ
  ========================= */

  function loadProfile() {

    const email =
      getCurrentUser();

    const users =
      getUsers();


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


    profileNickname.textContent =
      profile.nickname ||
      email.split("@")[0];


    profileDescription.textContent =
      profile.description ||
      "Описание профиля";


    nicknameInput.value =
      profile.nickname || "";


    descriptionInput.value =
      profile.description || "";


    profileEmail.value =
      email;


    selectedAvatar =
      profile.avatar || "";


    showAvatar(
      selectedAvatar
    );

  }


  /* =========================
     АВАТАР
  ========================= */

  function showAvatar(avatar) {

    if (avatar) {

      avatarPreview.src =
        avatar;

      return;
    }


    avatarPreview.src =
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
            y="57%"
            text-anchor="middle"
            font-size="75"
          >
            👤
          </text>
        </svg>
      `);

  }


  /* КНОПКА ВЫБРАТЬ ФОТО */

  avatarButton.addEventListener(
    "click",
    function () {

      avatarInput.click();

    }
  );


  /* ВЫБРАЛИ ФОТО */

  avatarInput.addEventListener(
    "change",
    function () {

      const file =
        avatarInput.files[0];


      if (!file) {

        return;
      }


      if (
        !file.type.startsWith("image/")
      ) {

        alert(
          "Выбери фотографию"
        );

        avatarInput.value = "";

        return;
      }


      const reader =
        new FileReader();


      reader.onload =
        function (event) {

          selectedAvatar =
            event.target.result;


          showAvatar(
            selectedAvatar
          );

        };


      reader.readAsDataURL(file);

    }
  );


  /* =========================
     ИЗМЕНИТЬ ПРОФИЛЬ
  ========================= */

  editProfileButton.addEventListener(
    "click",
    function () {

      loadProfile();

      editProfile.classList.remove(
        "hidden"
      );

      profileMessage.textContent =
        "";

    }
  );


  /* =========================
     СОХРАНИТЬ ПРОФИЛЬ
  ========================= */

  saveProfileButton.addEventListener(
    "click",
    function () {

      const email =
        getCurrentUser();

      const users =
        getUsers();


      if (!email || !users[email]) {

        return;
      }


      const nickname =
        nicknameInput.value.trim();

      const description =
        descriptionInput.value.trim();


      if (!nickname) {

        profileMessage.textContent =
          "Введите никнейм";

        return;
      }


      users[email].profile = {

        nickname:
          nickname,

        description:
          description,

        avatar:
          selectedAvatar

      };


      saveUsers(users);


      profileNickname.textContent =
        nickname;


      profileDescription.textContent =
        description ||
        "Описание профиля";


      showAvatar(
        selectedAvatar
      );


      profileMessage.textContent =
        "✓ Профиль сохранён";


      setTimeout(
        function () {

          editProfile.classList.add(
            "hidden"
          );

          profileMessage.textContent =
            "";

        },
        800
      );

    }
  );


  /* =========================
     ОТМЕНА
  ========================= */

  cancelProfileButton.addEventListener(
    "click",
    function () {

      editProfile.classList.add(
        "hidden"
      );

      profileMessage.textContent =
        "";

      loadProfile();

    }
  );


  /* =========================
     ЧАТЫ
  ========================= */

  chatsNav.addEventListener(
    "click",
    function () {

      showChats();

    }
  );


  function showChats() {

    chatsPage.classList.remove(
      "hidden"
    );

    profilePage.classList.add(
      "hidden"
    );

    pageTitle.textContent =
      "Чаты";


    chatsNav.classList.add(
      "active"
    );

    profileNav.classList.remove(
      "active"
    );

  }


  /* =========================
     ПРОФИЛЬ
  ========================= */

  profileNav.addEventListener(
    "click",
    function () {

      showProfile();

    }
  );


  function showProfile() {

    chatsPage.classList.add(
      "hidden"
    );

    profilePage.classList.remove(
      "hidden"
    );

    pageTitle.textContent =
      "Профиль";


    chatsNav.classList.remove(
      "active"
    );

    profileNav.classList.add(
      "active"
    );


    loadProfile();

  }


  /* =========================
     ВЫХОД
  ========================= */

  logoutButton.addEventListener(
    "click",
    function () {

      localStorage.removeItem(
        "messengerCurrentUser"
      );


      appScreen.classList.add(
        "hidden"
      );

      authScreen.classList.remove(
        "hidden"
      );


      emailInput.value = "";

      passwordInput.value = "";

      error.textContent = "";


      editProfile.classList.add(
        "hidden"
      );


      setMode("login");

    }
  );


  /* =========================
     АВТОВХОД
  ========================= */

  const currentUser =
    getCurrentUser();


  if (currentUser) {

    const users =
      getUsers();


    if (users[currentUser]) {

      openMessenger();

    } else {

      localStorage.removeItem(
        "messengerCurrentUser"
      );

    }

  }

});