let mode = "login";


function setMode(type) {

  mode = type;

  document.getElementById("loginTab")
    .classList.toggle("active", type === "login");

  document.getElementById("registerTab")
    .classList.toggle("active", type === "register");

  document.getElementById("authBtn").textContent =
    type === "login"
      ? "Войти"
      : "Зарегистрироваться";

  document.getElementById("error").textContent = "";
}


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


function authAction() {

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


  const users = getUsers();


  if (mode === "register") {

    if (users[email]) {

      error.textContent =
        "Такая почта уже зарегистрирована";

      return;
    }


    users[email] = {

      email: email,

      password: password,

      profile: {

        nickname: email.split("@")[0],

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


  if (!users[email]) {

    error.textContent =
      "Пользователь не найден";

    return;
  }


  if (users[email].password !== password) {

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


function openMessenger() {

  document.getElementById("auth").style.display =
    "none";

  document.getElementById("messenger").style.display =
    "block";

  showChats();
}


function showChats() {

  document.getElementById("chatsPage").style.display =
    "block";

  document.getElementById("profilePage").style.display =
    "none";

  document.getElementById("pageTitle").textContent =
    "Чаты";
}


function showProfile() {

  document.getElementById("chatsPage").style.display =
    "none";

  document.getElementById("profilePage").style.display =
    "block";

  document.getElementById("pageTitle").textContent =
    "Профиль";

  loadProfile();
}


function loadProfile() {

  const email =
    localStorage.getItem("messengerCurrentUser");

  const users = getUsers();

  const user = users[email];


  if (!user) return;


  if (!user.profile) {

    user.profile = {

      nickname: email.split("@")[0],

      description: "",

      avatar: ""

    };

    users[email] = user;

    saveUsers(users);
  }


  document.getElementById("userEmail")
    .textContent = email;


  document.getElementById("profileEmail")
    .textContent = email;


  document.getElementById("profileNickname")
    .textContent =
      user.profile.nickname || "Пользователь";


  document.getElementById("profileDescription")
    .textContent =
      user.profile.description ||
      "Описание не указано";


  const avatar =
    document.getElementById("profileAvatar");


  if (user.profile.avatar) {

    avatar.innerHTML =
      '<img src="' +
      user.profile.avatar +
      '" alt="Аватар">';

  } else {

    avatar.innerHTML = "👤";

  }
}


function logout() {

  localStorage.removeItem(
    "messengerCurrentUser"
  );

  document.getElementById("messenger").style.display =
    "none";

  document.getElementById("auth").style.display =
    "block";

  document.getElementById("email").value = "";

  document.getElementById("password").value = "";

  document.getElementById("error").textContent = "";

  setMode("login");
}


window.addEventListener("load", function() {

  const currentUser =
    localStorage.getItem("messengerCurrentUser");


  if (currentUser) {

    const users = getUsers();

    if (users[currentUser]) {

      openMessenger();

    }

  }

});