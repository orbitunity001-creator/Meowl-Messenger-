let mode = "login";


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
    .classList.toggle("active", mode === "login");

  document
    .getElementById("registerTab")
    .classList.toggle("active", mode === "register");

  document.getElementById("authButtonText").textContent =
    mode === "login"
      ? "Войти"
      : "Создать аккаунт";

  document.getElementById("error").textContent = "";
}


function auth() {

  const email =
    document
      .getElementById("email")
      .value
      .trim()
      .toLowerCase();

  const password =
    document.getElementById("password").value;

  const error =
    document.getElementById("error");

  error.textContent = "";


  if (!email || !password) {
    error.textContent = "Заполни все поля";
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


  if (users[email].password !== password) {
    error.textContent =
      "Неверный пароль";
    return;
  }


  localStorage.set