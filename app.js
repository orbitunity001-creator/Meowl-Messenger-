const SUPABASE_URL = "https://ehkdidgjiszpqqajsxsu.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_5-1jR2q3JRmXTAjksWFndA_yraWCUD2";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


async function registerUser() {

  const username =
    document.getElementById("username").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;

  const message =
    document.getElementById("authMessage");


  if (!username || !email || !password) {

    message.textContent =
      "Заполни все поля.";

    return;
  }


  if (password.length < 6) {

    message.textContent =
      "Пароль должен быть минимум 6 символов.";

    return;
  }


  message.textContent =
    "Создаём аккаунт...";


  const { data, error } =
    await supabaseClient.auth.signUp({

      email: email,

      password: password,

      options: {

        data: {
          username: username
        }

      }

    });


  if (error) {

    message.textContent =
      "Ошибка: " + error.message;

    return;
  }


  if (data.session) {

    message.textContent =
      "Аккаунт создан! 🎉";

    setTimeout(() => {

      openMessenger();

    }, 1000);

  } else {

    message.textContent =
      "Аккаунт создан! Проверь email и подтверди регистрацию.";

  }

}


async function loginUser() {

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;


  const message =
    document.getElementById("authMessage");


  if (!email || !password) {

    message.textContent =
      "Введи email и пароль.";

    return;
  }


  message.textContent =
    "Выполняем вход...";


  const { error } =
    await supabaseClient.auth.signInWithPassword({

      email: email,

      password: password

    });


  if (error) {

    message.textContent =
      "Ошибка: " + error.message;

    return;
  }


  openMessenger();

}


function openMessenger() {

  document.querySelector(".welcome").innerHTML = `

    <h2>🐱 Meowl Messenger</h2>

    <p>Ты вошёл в аккаунт!</p>

    <button
      class="full"
      onclick="createChat()"
    >
      💬 Новый чат
    </button>

    <div id="chatArea"></div>

  `;

}


function createChat() {

  const area =
    document.getElementById("chatArea");


  area.innerHTML = `

    <br>

    <input
      id="chatUser"
      type="text"
      placeholder="Имя пользователя"
    >

    <button
      class="full"
      onclick="openChat()"
    >
      Открыть чат
    </button>

  `;

}


function openChat() {

  const username =
    document.getElementById("chatUser").value.trim();


  if (!username) {

    alert("Введи имя пользователя.");

    return;
  }


  document.getElementById("chatArea").innerHTML = `

    <br>

    <h2>💬 ${username}</h2>

    <div id="messages"
         style="
         min-height:200px;
         padding:10px;
         background:#f3f3f3;
         border-radius:12px;
         margin-bottom:10px;
         ">
    </div>

    <input
      id="messageText"
      type="text"
      placeholder="Написать сообщение..."
      onkeydown="if(event.key==='Enter') sendMessage()"
    >

    <button
      class="full"
      onclick="sendMessage()"
    >
      ➤ Отправить
    </button>

  `;

}


function sendMessage() {

  const input =
    document.getElementById("messageText");

  const text =
    input.value.trim();


  if (!text) return;


  const messages =
    document.getElementById("messages");


  const message =
    document.createElement("div");


  message.textContent =
    text;


  message.style.cssText = `
    background:#222;
    color:white;
    padding:10px 14px;
    border-radius:14px;
    margin:7px 0;
    width:max-content;
    max-width:80%;
    margin-left:auto;
  `;


  messages.appendChild(message);

  input.value = "";

  messages.scrollTop =
    messages.scrollHeight;

}