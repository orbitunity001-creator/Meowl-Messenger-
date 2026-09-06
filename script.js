"use strict";

/*
    ==========================================
    MEOWL MESSENGER
    Local version without Firebase
    ==========================================
*/


/* ==========================================
   STORAGE KEYS
========================================== */

const USERS_KEY = "meowl_users_v3";
const CURRENT_USER_KEY = "meowl_current_user_v3";
const FAVORITES_KEY = "meowl_favorites_v3";


/* ==========================================
   DOM
========================================== */

const authScreen = document.getElementById("authScreen");
const appScreen = document.getElementById("appScreen");
const favoritesScreen = document.getElementById("favoritesScreen");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const authButton = document.getElementById("authButton");
const authError = document.getElementById("authError");

const chatsPage = document.getElementById("chatsPage");
const profilePage = document.getElementById("profilePage");

const pageTitle = document.getElementById("pageTitle");

const chatsNav = document.getElementById("chatsNav");
const profileNav = document.getElementById("profileNav");

const favoritesButton = document.getElementById("favoritesButton");
const favoritesPreview = document.getElementById("favoritesPreview");

const profileAvatar = document.getElementById("profileAvatar");
const avatarInput = document.getElementById("avatarInput");
const nicknameInput = document.getElementById("nicknameInput");
const descriptionInput = document.getElementById("descriptionInput");
const profileEmail = document.getElementById("profileEmail");

const saveProfileButton = document.getElementById("saveProfileButton");
const logoutButton = document.getElementById("logoutButton");
const profileSaved = document.getElementById("profileSaved");

const favoritesBack = document.getElementById("favoritesBack");
const clearFavorites = document.getElementById("clearFavorites");

const favoritesMessages = document.getElementById("favoritesMessages");

const attachButton = document.getElementById("attachButton");
const attachMenu = document.getElementById("attachMenu");

const choosePhoto = document.getElementById("choosePhoto");
const chooseVideo = document.getElementById("chooseVideo");

const photoInput = document.getElementById("photoInput");
const videoInput = document.getElementById("videoInput");

const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");


/* ==========================================
   STATE
========================================== */

let authMode = "login";

let currentUser = null;

let favorites = [];


/* ==========================================
   STORAGE HELPERS
========================================== */

function readStorage(key, fallback) {

    try {

        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        console.error("Storage read error:", error);

        return fallback;
    }
}


function writeStorage(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error("Storage write error:", error);

        return false;
    }
}


/* ==========================================
   USERS
========================================== */

function getUsers() {

    return readStorage(
        USERS_KEY,
        []
    );
}


function saveUsers(users) {

    return writeStorage(
        USERS_KEY,
        users
    );
}


/* ==========================================
   CURRENT USER
========================================== */

function getCurrentUser() {

    return readStorage(
        CURRENT_USER_KEY,
        null
    );
}


function setCurrentUser(user) {

    currentUser = user;

    writeStorage(
        CURRENT_USER_KEY,
        user
    );
}


function removeCurrentUser() {

    currentUser = null;

    localStorage.removeItem(
        CURRENT_USER_KEY
    );
}


/* ==========================================
   FAVORITES
========================================== */

function getFavorites() {

    if (!currentUser) {
        return [];
    }

    const allFavorites = readStorage(
        FAVORITES_KEY,
        {}
    );

    return allFavorites[currentUser.email] || [];
}


function saveFavorites(messages) {

    if (!currentUser) {
        return false;
    }

    const allFavorites = readStorage(
        FAVORITES_KEY,
        {}
    );

    allFavorites[currentUser.email] = messages;

    return writeStorage(
        FAVORITES_KEY,
        allFavorites
    );
}


/* ==========================================
   DEFAULT AVATAR
========================================== */

function defaultAvatar() {

    const svg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="300"
            height="300"
            viewBox="0 0 300 300"
        >

            <defs>

                <linearGradient
                    id="g"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop
                        offset="0%"
                        stop-color="#9d5cff"
                    />

                    <stop
                        offset="100%"
                        stop-color="#35ddff"
                    />
                </linearGradient>

            </defs>

            <rect
                width="300"
                height="300"
                rx="90"
                fill="url(#g)"
            />

            <text
                x="150"
                y="190"
                text-anchor="middle"
                font-size="125"
            >
                🐱
            </text>

        </svg>
    `;

    return "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg);
}


/* ==========================================
   TIME
========================================== */

function getTime() {

    const now = new Date();

    return now.toLocaleTimeString(
        "ru-RU",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* ==========================================
   AUTH MODE
========================================== */

function setAuthMode(mode) {

    authMode = mode;

    authError.textContent = "";

    emailInput.value = "";
    passwordInput.value = "";

    if (mode === "login") {

        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        authButton.textContent = "Продолжить";

        passwordInput.autocomplete =
            "current-password";

    } else {

        registerTab.classList.add("active");
        loginTab.classList.remove("active");

        authButton.textContent =
            "Зарегистрироваться";

        passwordInput.autocomplete =
            "new-password";
    }
}


/* ==========================================
   AUTH TABS
========================================== */

loginTab.addEventListener(
    "click",
    () => setAuthMode("login")
);


registerTab.addEventListener(
    "click",
    () => setAuthMode("register")
);


/* ==========================================
   AUTH SUBMIT
========================================== */

authForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        authError.textContent = "";

        const email =
            emailInput.value
                .trim()
                .toLowerCase();

        const password =
            passwordInput.value;

        if (!email) {

            authError.textContent =
                "Введите email.";

            return;
        }

        if (!password) {

            authError.textContent =
                "Введите пароль.";

            return;
        }

        if (password.length < 4) {

            authError.textContent =
                "Пароль должен содержать минимум 4 символа.";

            return;
        }


        const users = getUsers();


        /* =====================
           REGISTRATION
        ====================== */

        if (authMode === "register") {

            const exists = users.some(
                user => user.email === email
            );

            if (exists) {

                authError.textContent =
                    "Этот email уже зарегистрирован.";

                return;
            }


            const newUser = {

                id:
                    Date.now().toString() +
                    Math.random()
                        .toString(16)
                        .slice(2),

                email: email,

                password: password,

                nickname:
                    email.split("@")[0] ||
                    "Meowl",

                description: "",

                avatar:
                    defaultAvatar(),

                createdAt:
                    new Date().toISOString()

            };


            users.push(newUser);

            const saved = saveUsers(users);

            if (!saved) {

                authError.textContent =
                    "Не удалось сохранить аккаунт в браузере.";

                return;
            }


            setCurrentUser(newUser);

            openApp();

            return;
        }


        /* =====================
           LOGIN
        ====================== */

        const user = users.find(
            item =>
                item.email === email &&
                item.password === password
        );


        if (!user) {

            authError.textContent =
                "Неверный email или пароль.";

            return;
        }


        setCurrentUser(user);

        openApp();
    }
);


/* ==========================================
   OPEN APP
========================================== */

function openApp() {

    if (!currentUser) {
        return;
    }

    authScreen.classList.add("hidden");

    favoritesScreen.classList.add("hidden");

    appScreen.classList.remove("hidden");

    openChats();
}


/* ==========================================
   OPEN CHATS
========================================== */

function openChats() {

    chatsPage.classList.remove("hidden");

    profilePage.classList.add("hidden");

    pageTitle.textContent = "Чаты";

    chatsNav.classList.add("active");
    profileNav.classList.remove("active");

    updateFavoritesPreview();
}


/* ==========================================
   OPEN PROFILE
========================================== */

function openProfile() {

    chatsPage.classList.add("hidden");

    profilePage.classList.remove("hidden");

    pageTitle.textContent = "Профиль";

    chatsNav.classList.remove("active");
    profileNav.classList.add("active");

    loadProfile();
}


/* ==========================================
   NAVIGATION
========================================== */

chatsNav.addEventListener(
    "click",
    openChats
);


profileNav.addEventListener(
    "click",
    openProfile
);


/* ==========================================
   PROFILE LOAD
========================================== */

function loadProfile() {

    if (!currentUser) {
        return;
    }

    profileAvatar.src =
        currentUser.avatar ||
        defaultAvatar();

    nicknameInput.value =
        currentUser.nickname || "";

    descriptionInput.value =
        currentUser.description || "";

    profileEmail.value =
        currentUser.email || "";

    profileSaved.textContent = "";
}


/* ==========================================
   PROFILE AVATAR
========================================== */

avatarInput.addEventListener(
    "change",
    function() {

        const file =
            avatarInput.files &&
            avatarInput.files[0];

        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            alert("Выберите изображение.");

            avatarInput.value = "";

            return;
        }


        if (file.size > 4 * 1024 * 1024) {

            alert(
                "Фото слишком большое. Максимальный размер — 4 МБ."
            );

            avatarInput.value = "";

            return;
        }


        const reader = new FileReader();


        reader.onload = function() {

            profileAvatar.src =
                reader.result;

            currentUser.avatar =
                reader.result;
        };


        reader.onerror = function() {

            alert(
                "Не удалось прочитать изображение."
            );
        };


        reader.readAsDataURL(file);
    }
);


/* ==========================================
   SAVE PROFILE
========================================== */

saveProfileButton.addEventListener(
    "click",
    function() {

        if (!currentUser) {
            return;
        }


        const nickname =
            nicknameInput.value.trim();

        const description =
            descriptionInput.value.trim();


        if (!nickname) {

            alert(
                "Введите никнейм."
            );

            nicknameInput.focus();

            return;
        }


        currentUser.nickname =
            nickname.slice(0, 30);

        currentUser.description =
            description.slice(0, 150);


        const users = getUsers();

        const index = users.findIndex(
            user =>
                user.email === currentUser.email
        );


        if (index === -1) {

            alert(
                "Пользователь не найден."
            );

            return;
        }


        users[index] = currentUser;


        const saved = saveUsers(users);


        if (!saved) {

            alert(
                "Не удалось сохранить профиль."
            );

            return;
        }


        setCurrentUser(currentUser);

        profileSaved.textContent =
            "✓ Профиль сохранён";


        setTimeout(
            () => {
                profileSaved.textContent = "";
            },
            2500
        );
    }
);


/* ==========================================
   LOGOUT
========================================== */

logoutButton.addEventListener(
    "click",
    function() {

        const confirmed =
            confirm(
                "Выйти из аккаунта?"
            );

        if (!confirmed) {
            return;
        }


        removeCurrentUser();

        favoritesScreen.classList.add(
            "hidden"
        );

        appScreen.classList.add(
            "hidden"
        );

        authScreen.classList.remove(
            "hidden"
        );


        setAuthMode("login");
    }
);


/* ==========================================
   FAVORITES OPEN
========================================== */

favoritesButton.addEventListener(
    "click",
    function() {

        favoritesScreen.classList.remove(
            "hidden"
        );

        attachMenu.classList.add(
            "hidden"
        );

        renderFavorites();

        setTimeout(
            () => {

                messageInput.focus();

                scrollMessagesToBottom();

            },
            100
        );
    }
);


/* ==========================================
   FAVORITES BACK
========================================== */

favoritesBack.addEventListener(
    "click",
    function() {

        favoritesScreen.classList.add(
            "hidden"
        );

        attachMenu.classList.add(
            "hidden"
        );

        updateFavoritesPreview();
    }
);


/* ==========================================
   RENDER FAVORITES
========================================== */

function renderFavorites() {

    favorites =
        getFavorites();


    favoritesMessages.innerHTML = "";


    if (favorites.length === 0) {

        const empty =
            document.createElement("div");

        empty.className =
            "empty-chat";


        empty.innerHTML = `
            <div class="empty-chat-icon">
                ⭐
            </div>

            <div class="empty-chat-title">
                Избранное пусто
            </div>

            <div class="empty-chat-text">
                Отправь себе сообщение,<br>
                фото или видео.
            </div>
        `;


        favoritesMessages.appendChild(
            empty
        );

        return;
    }


    favorites.forEach(
        message => {

            const element =
                createMessageElement(
                    message
                );

            favoritesMessages.appendChild(
                element
            );
        }
    );


    scrollMessagesToBottom();
}


/* ==========================================
   CREATE MESSAGE
========================================== */

function createMessageElement(message) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "message";


    if (message.type === "text") {

        const text =
            document.createElement("div");

        text.className =
            "message-text";

        text.textContent =
            message.text;

        wrapper.appendChild(
            text
        );
    }


    if (message.type === "image") {

        const image =
            document.createElement("img");

        image.className =
            "message-media";

        image.src =
            message.data;

        image.alt =
            "Фото";

        image.loading =
            "lazy";

        wrapper.appendChild(
            image
        );
    }


    if (message.type === "video") {

        const video =
            document.createElement("video");

        video.className =
            "message-video";

        video.src =
            message.data;

        video.controls =
            true;

        video.preload =
            "metadata";

        wrapper.appendChild(
            video
        );
    }


    const time =
        document.createElement("div");

    time.className =
        "message-time";

    time.textContent =
        message.time || "";


    wrapper.appendChild(
        time
    );


    return wrapper;
}


/* ==========================================
   SEND TEXT
========================================== */

messageForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const text =
            messageInput.value.trim();


        if (!text) {
            return;
        }


        addFavoriteMessage({

            id:
                Date.now().toString() +
                Math.random()
                    .toString(16)
                    .slice(2),

            type:
                "text",

            text:
                text,

            time:
                getTime(),

            createdAt:
                new Date().toISOString()

        });


        messageInput.value = "";

        messageInput.focus();
    }
);


/* ==========================================
   ADD FAVORITE MESSAGE
========================================== */

function addFavoriteMessage(message) {

    favorites =
        getFavorites();


    favorites.push(
        message
    );


    const saved =
        saveFavorites(
            favorites
        );


    if (!saved) {

        alert(
            "Не удалось сохранить сообщение. Возможно, в памяти браузера закончилось место."
        );

        return;
    }


    renderFavorites();

    updateFavoritesPreview();
}


/* ==========================================
   ATTACH MENU
========================================== */

attachButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        attachMenu.classList.toggle(
            "hidden"
        );
    }
);


document.addEventListener(
    "click",
    function(event) {

        if (
            !attachMenu.contains(event.target) &&
            event.target !== attachButton
        ) {

            attachMenu.classList.add(
                "hidden"
            );
        }
    }
);


/* ==========================================
   PHOTO
========================================== */

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
            photoInput.files &&
            photoInput.files[0];


        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            alert(
                "Выберите изображение."
            );

            photoInput.value = "";

            return;
        }


        if (file.size > 4 * 1024 * 1024) {

            alert(
                "Фото слишком большое. Максимальный размер — 4 МБ."
            );

            photoInput.value = "";

            return;
        }


        readFileAsDataURL(
            file,
            function(data) {

                addFavoriteMessage({

                    id:
                        Date.now().toString() +
                        Math.random()
                            .toString(16)
                            .slice(2),

                    type:
                        "image",

                    data:
                        data,

                    name:
                        file.name,

                    time:
                        getTime(),

                    createdAt:
                        new Date().toISOString()

                });

                photoInput.value = "";
            }
        );
    }
);


/* ==========================================
   VIDEO
========================================== */

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
            videoInput.files &&
            videoInput.files[0];


        if (!file) {
            return;
        }


        if (!file.type.startsWith("video/")) {

            alert(
                "Выберите видео."
            );

            videoInput.value = "";

            return;
        }


        if (file.size > 6 * 1024 * 1024) {

            alert(
                "Видео слишком большое. Максимальный размер — 6 МБ."
            );

            videoInput.value = "";

            return;
        }


        readFileAsDataURL(
            file,
            function(data) {

                addFavoriteMessage({

                    id:
                        Date.now().toString() +
                        Math.random()
                            .toString(16)
                            .slice(2),

                    type:
                        "video",

                    data:
                        data,

                    name:
                        file.name,

                    time:
                        getTime(),

                    createdAt:
                        new Date().toISOString()

                });

                videoInput.value = "";
            }
        );
    }
);


/* ==========================================
   FILE READER
========================================== */

function readFileAsDataURL(
    file,
    callback
) {

    const reader =
        new FileReader();


    reader.onload = function() {

        callback(
            reader.result
        );
    };


    reader.onerror = function() {

        alert(
            "Не удалось прочитать файл."
        );
    };


    reader.readAsDataURL(file);
}


/* ==========================================
   CLEAR FAVORITES
========================================== */

clearFavorites.addEventListener(
    "click",
    function() {

        const messages =
            getFavorites();


        if (messages.length === 0) {
            return;
        }


        const confirmed =
            confirm(
                "Удалить все сообщения из Избранного?"
            );


        if (!confirmed) {
            return;
        }


        saveFavorites([]);

        favorites = [];

        renderFavorites();

        updateFavoritesPreview();
    }
);


/* ==========================================
   PREVIEW
========================================== */

function updateFavoritesPreview() {

    const messages =
        getFavorites();


    if (!messages.length) {

        favoritesPreview.textContent =
            "Здесь будут твои сообщения";

        return;
    }


    const last =
        messages[messages.length - 1];


    if (last.type === "text") {

        favoritesPreview.textContent =
            last.text;

        return;
    }


    if (last.type === "image") {

        favoritesPreview.textContent =
            "🖼️ Фото";

        return;
    }


    if (last.type === "video") {

        favoritesPreview.textContent =
            "🎥 Видео";

        return;
    }


    favoritesPreview.textContent =
        "Новое сообщение";
}


/* ==========================================
   SCROLL
========================================== */

function scrollMessagesToBottom() {

    requestAnimationFrame(
        () => {

            favoritesMessages.scrollTop =
                favoritesMessages.scrollHeight;
        }
    );
}


/* ==========================================
   ENTER SEND
========================================== */

messageInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            messageForm.requestSubmit();
        }
    }
);


/* ==========================================
   RESTORE SESSION
========================================== */

function restoreSession() {

    const savedUser =
        getCurrentUser();


    if (!savedUser) {

        authScreen.classList.remove(
            "hidden"
        );

        appScreen.classList.add(
            "hidden"
        );

        favoritesScreen.classList.add(
            "hidden"
        );

        return;
    }


    const users =
        getUsers();


    const actualUser =
        users.find(
            user =>
                user.email ===
                savedUser.email
        );


    if (!actualUser) {

        removeCurrentUser();

        authScreen.classList.remove(
            "hidden"
        );

        appScreen.classList.add(
            "hidden"
        );

        return;
    }


    currentUser =
        actualUser;


    writeStorage(
        CURRENT_USER_KEY,
        actualUser
    );


    openApp();
}


/* ==========================================
   START
========================================== */

setAuthMode("login");

restoreSession();