const authScreen = document.getElementById("authScreen");
const chatScreen = document.getElementById("chatScreen");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const authForm = document.getElementById("authForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const errorMessage = document.getElementById("errorMessage");

const logoutButton = document.getElementById("logoutButton");

const userEmail = document.getElementById("userEmail");

const pageTitle = document.getElementById("pageTitle");

const chatsPage = document.getElementById("chatsPage");
const profilePage = document.getElementById("profilePage");

const chatsButton = document.getElementById("chatsButton");
const profileButton = document.getElementById("profileButton");

const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");

const nicknameInput = document.getElementById("nickname");
const descriptionInput = document.getElementById("description");

const profileEmail = document.getElementById("profileEmail");

const saveProfile =
    document.getElementById("saveProfile");

const profileMessage =
    document.getElementById("profileMessage");

let isRegisterMode = false;


/* ВХОД */

loginTab.addEventListener("click", () => {

    isRegisterMode = false;

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    authForm.querySelector(".main-button").textContent =
        "Войти";

    errorMessage.textContent = "";
});


/* РЕГИСТРАЦИЯ */

registerTab.addEventListener("click", () => {

    isRegisterMode = true;

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    authForm.querySelector(".main-button").textContent =
        "Зарегистрироваться";

    errorMessage.textContent = "";
});


/* ФОРМА */

authForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email =
        emailInput.value.trim().toLowerCase();

    const password =
        passwordInput.value;

    errorMessage.textContent = "";


    if (!email || !password) {

        errorMessage.textContent =
            "Заполни все поля.";

        return;
    }


    if (password.length < 6) {

        errorMessage.textContent =
            "Пароль минимум 6 символов.";

        return;
    }


    if (isRegisterMode) {

        registerUser(email, password);

    } else {

        loginUser(email, password);

    }

});


/* РЕГИСТРАЦИЯ */

function registerUser(email, password) {

    const users =
        JSON.parse(
            localStorage.getItem("messengerUsers")
        ) || {};


    if (users[email]) {

        errorMessage.textContent =
            "Такой аккаунт уже существует.";

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


    localStorage.setItem(
        "messengerUsers",
        JSON.stringify(users)
    );


    localStorage.setItem(
        "messengerCurrentUser",
        email
    );


    openMessenger(email);
}


/* ВХОД */

function loginUser(email, password) {

    const users =
        JSON.parse(
            localStorage.getItem("messengerUsers")
        ) || {};


    const user = users[email];


    if (!user) {

        errorMessage.textContent =
            "Аккаунт не найден.";

        return;
    }


    if (user.password !== password) {

        errorMessage.textContent =
            "Неверный пароль.";

        return;
    }


    if (!user.profile) {

        user.profile = {

            nickname:
                email.split("@")[0],

            description: "",

            avatar: ""

        };

        users[email] = user;

        localStorage.setItem(
            "messengerUsers",
            JSON.stringify(users)
        );
    }


    localStorage.setItem(
        "messengerCurrentUser",
        email
    );


    openMessenger(email);
}


/* ОТКРЫТЬ ПРИЛОЖЕНИЕ */

function openMessenger(email) {

    authScreen.classList.add("hidden");

    chatScreen.classList.remove("hidden");

    userEmail.textContent = email;

    authForm.reset();

    loadProfile(email);

    showChats();
}


/* ЧАТЫ */

function showChats() {

    chatsPage.classList.remove("hidden");

    profilePage.classList.add("hidden");

    chatsButton.classList.add("active");

    profileButton.classList.remove("active");

    pageTitle.textContent = "Чаты";
}


chatsButton.addEventListener("click", showChats);


/* ПРОФИЛЬ */

profileButton.addEventListener("click", () => {

    chatsPage.classList.add("hidden");

    profilePage.classList.remove("hidden");

    chatsButton.classList.remove("active");

    profileButton.classList.add("active");

    pageTitle.textContent = "Профиль";


    const currentUser =
        localStorage.getItem(
            "messengerCurrentUser"
        );


    if (currentUser) {
        loadProfile(currentUser);
    }
});


/* ЗАГРУЗКА ПРОФИЛЯ */

function loadProfile(email) {

    const users =
        JSON.parse(
            localStorage.getItem("messengerUsers")
        ) || {};


    const user = users[email];


    if (!user) {
        return;
    }


    if (!user.profile) {

        user.profile = {

            nickname:
                email.split("@")[0],

            description: "",

            avatar: ""

        };
    }


    nicknameInput.value =
        user.profile.nickname || "";


    descriptionInput.value =
        user.profile.description || "";


    profileEmail.textContent = email;


    if (user.profile.avatar) {

        avatarPreview.innerHTML =
            `<img src="${user.profile.avatar}" alt="Аватар">`;

    } else {

        avatarPreview.innerHTML = "👤";
    }
}


/* АВАТАР */

avatarInput.addEventListener("change", () => {

    const file =
        avatarInput.files[0];


    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        alert("Выбери изображение.");

        return;
    }


    const reader = new FileReader();


    reader.onload = (event) => {

        avatarPreview.innerHTML =
            `<img src="${event.target.result}" alt="Аватар">`;
    };


    reader.readAsDataURL(file);
});


/* СОХРАНЕНИЕ ПРОФИЛЯ */

saveProfile.addEventListener("click", () => {

    const currentUser =
        localStorage.getItem(
            "messengerCurrentUser"
        );


    if (!currentUser) {
        return;
    }


    const users =
        JSON.parse(
            localStorage.getItem("messengerUsers")
        ) || {};


    const user = users[currentUser];


    if (!user) {
        return;
    }


    const nickname =
        nicknameInput.value.trim()
        || currentUser.split("@")[0];


    const description =
        descriptionInput.value.trim();


    const image =
        avatarPreview.querySelector("img");


    let avatar =
        user.profile?.avatar || "";


    if (image) {
        avatar = image.src;
    }


    user.profile = {

        nickname: nickname,

        description: description,

        avatar: avatar
    };


    users[currentUser] = user;


    localStorage.setItem(
        "messengerUsers",
        JSON.stringify(users)
    );


    profileMessage.textContent =
        "✓ Профиль сохранён";


    setTimeout(() => {

        profileMessage.textContent = "";

    }, 2500);
});


/* ВЫХОД */

logoutButton.addEventListener("click", () => {

    localStorage.removeItem(
        "messengerCurrentUser"
    );


    chatScreen.classList.add("hidden");

    authScreen.classList.remove("hidden");

    errorMessage.textContent = "";

    showChats();
});


/* АВТОВХОД */

const currentUser =
    localStorage.getItem(
        "messengerCurrentUser"
    );


if (currentUser) {

    openMessenger(currentUser);
}