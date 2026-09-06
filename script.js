const STORAGE = "meowl_favorites_messages";

let messages = JSON.parse(
  localStorage.getItem(STORAGE) || "[]"
);

let authMode = "login";

const $ = id => document.getElementById(id);

const authScreen = $("authScreen");
const appScreen = $("appScreen");
const chatScreen = $("chatScreen");
const profileScreen = $("profileScreen");

function hideScreens() {
  authScreen.classList.add("hidden");
  appScreen.classList.add("hidden");
  chatScreen.classList.add("hidden");
  profileScreen.classList.add("hidden");
}

function show(screen) {
  hideScreens();
  screen.classList.remove("hidden");
}


/* =====================
   ВХОД / РЕГИСТРАЦИЯ
===================== */

$("loginTab").onclick = () => {
  authMode = "login";

  $("loginTab").classList.add("active");
  $("registerTab").classList.remove("active");

  $("authButton").textContent = "Продолжить";
  $("authError").textContent = "";
};

$("registerTab").onclick = () => {
  authMode = "register";

  $("registerTab").classList.add("active");
  $("loginTab").classList.remove("active");

  $("authButton").textContent = "Зарегистрироваться";
  $("authError").textContent = "";
};


$("authButton").onclick = () => {

  const email = $("email").value.trim();
  const password = $("password").value;

  if (!email || !password) {
    $("authError").textContent =
      "Заполни email и пароль.";
    return;
  }

  if (password.length < 4) {
    $("authError").textContent =
      "Пароль должен быть минимум 4 символа.";
    return;
  }

  /*
    Без Firebase это локальный вход.
    Настоящего сервера здесь нет.
  */

  localStorage.setItem(
    "meowl_email",
    email
  );

  localStorage.setItem(
    "meowl_logged",
    "true"
  );

  show(appScreen);
};


/* =====================
   ВЫХОД
===================== */

$("logout").onclick = () => {

  localStorage.removeItem("meowl_logged");

  show(authScreen);
};


/* =====================
   ОТКРЫТЬ ИЗБРАННОЕ
===================== */

$("favorites").onclick = () => {

  show(chatScreen);

  renderMessages();

};


/* =====================
   НАЗАД
===================== */

$("back").onclick = () => {
  show(appScreen);
};


/* =====================
   СООБЩЕНИЕ
===================== */

$("messageForm").onsubmit = event => {

  event.preventDefault();

  const text =
    $("message").value.trim();

  if (!text) return;

  addMessage({
    type: "text",
    text: text,
    time: getTime()
  });

  $("message").value = "";

  renderMessages();
};


function addMessage(message) {

  messages.push({
    id: Date.now(),
    ...message
  });

  save();
}


function save() {

  try {

    localStorage.setItem(
      STORAGE,
      JSON.stringify(messages)
    );

  } catch {

    alert(
      "Не хватает памяти браузера. Удали большие видео."
    );

  }
}


/* =====================
   ФОТО / ВИДЕО
===================== */

$("attach").onclick = () => {

  $("attachMenu").classList.toggle("hidden");

};

$("photoButton").onclick = () => {
  $("photoInput").click();
};

$("videoButton").onclick = () => {
  $("videoInput").click();
};


$("photoInput").onchange = event => {

  const file = event.target.files[0];

  if (!file) return;

  readFile(file, "image");

  event.target.value = "";

};


$("videoInput").onchange = event => {

  const file = event.target.files[0];

  if (!file) return;

  readFile(file, "video");

  event.target.value = "";

};


function readFile(file, type) {

  const limit =
    type === "video"
      ? 8 * 1024 * 1024
      : 5 * 1024 * 1024;

  if (file.size > limit) {

    alert(
      type === "video"
        ? "Видео максимум 8 МБ."
        : "Фото максимум 5 МБ."
    );

    return;
  }

  const reader = new FileReader();

  reader.onload = () => {

    addMessage({
      type: type,
      data: reader.result,
      name: file.name,
      time: getTime()
    });

    renderMessages();
  };

  reader.readAsDataURL(file);
}


/* =====================
   ОТОБРАЖЕНИЕ
===================== */

function renderMessages() {

  const container = $("messages");

  container.innerHTML = "";

  if (messages.length === 0) {

    container.innerHTML = `
      <div class="empty">
        <div class="empty-icon">⭐</div>
        <strong>Избранное</strong>
        <p>Твои личные сообщения,<br>
        фотографии и видео.</p>
      </div>
    `;

    return;
  }


  messages.forEach(item => {

    const row =
      document.createElement("div");

    row.className =
      "message-row";


    const bubble =
      document.createElement("div");

    bubble.className =
      "message";


    if (item.type === "text") {

      const text =
        document.createElement("div");

      text.className =
        "message-text";

      text.textContent =
        item.text;

      bubble.appendChild(text);

    }


    if (item.type === "image") {

      const image =
        document.createElement("img");

      image.src =
        item.data;

      image.alt =
        "Фото";

      bubble.appendChild(image);

    }


    if (item.type === "video") {

      const video =
        document.createElement("video");

      video.src =
        item.data;

      video.controls = true;
      video.playsInline = true;

      bubble.appendChild(video);

    }


    const time =
      document.createElement("div");

    time.className =
      "time";

    time.textContent =
      item.time;


    bubble.appendChild(time);

    row.appendChild(bubble);

    container.appendChild(row);

  });


  container.scrollTop =
    container.scrollHeight;


  updatePreview();
}


/* =====================
   ПРЕВЬЮ
===================== */

function updatePreview() {

  const preview = $("preview");

  if (!messages.length) {

    preview.textContent =
      "Чат с самим собой";

    return;
  }

  const last =
    messages[messages.length - 1];

  if (last.type === "text") {
    preview.textContent =
      last.text;
  }

  if (last.type === "image") {
    preview.textContent =
      "🖼️ Фото";
  }

  if (last.type === "video") {
    preview.textContent =
      "🎥 Видео";
  }
}


/* =====================
   ОЧИСТКА
===================== */

$("clear").onclick = () => {

  if (!messages.length) return;

  if (!confirm("Удалить всю переписку?")) {
    return;
  }

  messages = [];

  save();

  renderMessages();
};


/* =====================
   ПРОФИЛЬ
===================== */

$("profileButton").onclick = () => {
  show(profileScreen);
};

$("chatsButton").onclick = () => {
  show(appScreen);
};

$("profileBack").onclick = () => {
  show(appScreen);
};


/* =====================
   ВРЕМЯ
===================== */

function getTime() {

  return new Date().toLocaleTimeString(
    "ru-RU",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}


/* =====================
   ЗАПУСК
===================== */

if (
  localStorage.getItem("meowl_logged") === "true"
) {
  show(appScreen);
} else {
  show(authScreen);
}

updatePreview();