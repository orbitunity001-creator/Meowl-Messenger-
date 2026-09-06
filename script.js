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

let isRegisterMode = false;


/* Переключение между входом и регистрацией */

loginTab.addEventListener("click", () => {

    isRegisterMode = false;

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    authForm.querySelector(".main-button").textContent = "Войти";

    errorMessage.textContent = "";
});


registerTab.addEventListener("click", () => {

    isRegisterMode = true;

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    authForm.querySelector(".main-button").textContent =
        "Зарегистрироваться";

    errorMessage.textContent = "";
});


/* Регистрация / вход */

authForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    errorMessage.textContent = "";

    if (!email || !password) {

        errorMessage.textContent =
            "Заполни все поля.";

        return;
    }

    if (password.length < 6) {

        errorMessage.textContent =
            "Пароль должен быть минимум 6 символов.";

        return;
    }


    if (isRegisterMode) {

        registerUser(email, password);

    } else {

        loginUser(email, password);

    }

});


/* Регистрация */

function registerUser(email, password) {

    const users =
        JSON.parse(localStorage.getItem("messengerUsers")) || {};

    if (users[email]) {

        errorMessage.textContent =
            "Такой аккаунт уже существует.";

        return;
    }

    users[email] = {
        email: email,
        password: password
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


/* Вход */

function loginUser(email, password) {

    const users =
        JSON.parse(localStorage.getItem("messengerUsers")) || {};

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

    localStorage.setItem(
        "messengerCurrentUser",
        email
    );

    openMessenger(email);
}


/* Открыть мессенджер */

function openMessenger(email) {

    authScreen.classList.add("hidden");

    chatScreen.classList.remove("hidden");

    userEmail.textContent = email;

    authForm.reset();
}


/* Выход */

logoutButton.addEventListener("click", () => {

    localStorage.removeItem(
        "messengerCurrentUser"
    );

    chatScreen.classList.add("hidden");

    authScreen.classList.remove("hidden");

    errorMessage.textContent = "";
});


/* Проверяем, был ли пользователь авторизован */

const currentUser =
    localStorage.getItem("messengerCurrentUser");

if (currentUser) {

    openMessenger(currentUser);

}

/* =========================
   ПРОФИЛЬ
========================= */

const avatarInput =
    document.getElementById("avatarInput");

const avatarPreview =
    document.getElementById("avatarPreview");

const nicknameInput =
    document.getElementById("nickname");

const descriptionInput =
    document.getElementById("description");

const profileEmail =
    document.getElementById("profileEmail");

const saveProfileButton =
    document.getElementById("saveProfile");

const profileMessage =
    document.getElementById("profileMessage");


/* Открытие профиля */

function showProfile() {

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
}


/* Загрузка профиля */

function loadProfile(email) {

    const users =
        JSON.parse(
            localStorage.getItem(
                "messengerUsers"
            )
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

        users[email] = user;

        localStorage.setItem(
            "messengerUsers",
            JSON.stringify(users)
        );
    }


    nicknameInput.value =
        user.profile.nickname || "";


    descriptionInput.value =
        user.profile.description || "";


    profileEmail.textContent =
        email;


    if (user.profile.avatar) {

        avatarPreview.innerHTML =
            `<img src="${user.profile.avatar}" alt="Аватар">`;

    } else {

        avatarPreview.innerHTML = "👤";

    }
}


/* Выбор аватара */

avatarInput.addEventListener(
    "change",
    function () {

        const file =
            avatarInput.files[0];


        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            alert("Выбери изображение.");

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                avatarPreview.innerHTML =
                    `<img src="${event.target.result}" alt="Аватар">`;

            };


        reader.readAsDataURL(file);
    }
);


/* Сохранение профиля */

saveProfileButton.addEventListener(
    "click",
    function () {

        const currentUser =
            localStorage.getItem(
                "messengerCurrentUser"
            );


        if (!currentUser) {
            return;
        }


        const users =
            JSON.parse(
                localStorage.getItem(
                    "messengerUsers"
                )
            ) || {};


        const user =
            users[currentUser];


        if (!user) {
            return;
        }


        let nickname =
            nicknameInput.value.trim();


        if (!nickname) {

            nickname =
                currentUser.split("@")[0];

        }


        let avatar = "";


        const image =
            avatarPreview.querySelector("img");


        if (image) {

            avatar = image.src;

        } else {

            avatar =
                user.profile?.avatar || "";

        }


        user.profile = {

            nickname: nickname,

            description:
                descriptionInput.value.trim(),

            avatar: avatar

        };


        users[currentUser] = user;


        localStorage.setItem(
            "messengerUsers",
            JSON.stringify(users)
        );


        profileMessage.textContent =
            "✓ Профиль сохранён";


        setTimeout(
            function () {

                profileMessage.textContent = "";

            },
            2500
        );
    }
);