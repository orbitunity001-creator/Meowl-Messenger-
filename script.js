let mode = "login";
let selectedAvatar = "";


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


  setAvatar(
    "profileAvatar",
    user.profile.avatar
  );
}


function setAvatar(id, avatar) {

  const element =
    document.getElementById(id);


  if (avatar) {

    element.innerHTML =
      '<img src="' +
      avatar +
      '" alt="Аватар">';

  } else {

    element.innerHTML = "👤";

  }
}


function openEditProfile() {

  const email =
    localStorage.getItem("messengerCurrentUser");

  const users = getUsers();

  const user = users[email];


  if (!user) return;


  document.getElementById("editBox").style.display =
    "block";


  document.getElementById("nicknameInput").value =
    user.profile.nickname || "";


  document.getElementById("descriptionInput").value =
    user.profile.description || "";


  document.getElementById("emailInput").value =
    email;


  selectedAvatar =
    user.profile.avatar || "";


  setAvatar(
    "editAvatar",
    selectedAvatar
  );


  document.getElementById("editBox")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}


function selectAvatar(event) {

  const file =
    event.target.files[0];


  if (!file) return;


  if (!file.type.startsWith("image/")) {

    alert("Выбери изображение");

    return;
  }


  const reader =
    new FileReader();


  reader.onload = function(event) {

    selectedAvatar =
      event.target.result;


    setAvatar(
      "editAvatar",
      selectedAvatar
    );

  };


  reader.readAsDataURL(file);
}


function saveProfile() {

  const email =
    localStorage.getItem("messengerCurrentUser");

  const users = getUsers();


  if (!users[email]) return;


  let nickname =
    document.getElementById("nicknameInput")
      .value
      .trim();


  const description =
    document.getElementById("descriptionInput")
      .value
      .trim();


  if (!nickname) {

    nickname =
      email.split("@")[0];
  }


  /*
    СОХРАНЯЕМ ПРОФИЛЬ ВМЕСТЕ
    С АВАТАРОМ, НИКОГДА НЕ СТИРАЕМ
  */

  users[email].profile = {

    nickname: nickname,

    description: description,

    avatar: selectedAvatar

  };


  saveUsers(users);


  document.getElementById("editBox").style.display =
    "none";


  loadProfile();
}


function closeEditProfile() {

  document.getElementById("editBox").style.display =
    "none";


  selectedAvatar = "";

  loadProfile();
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