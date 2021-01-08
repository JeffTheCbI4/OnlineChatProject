var stompClient = null;

//Функция, меняющая состояния кнопок и тела чата при подключении/отключении
function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#chat").show();
    } else {
        $("#chat").hide();
    }
    $("#chatBody").html("");
}

//Функция, создающая сокет чата
function connect() {
    var socket = new SockJS('/chat-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/messages', function (message) {
            showMessage(JSON.parse(message.body));
        });
    });
}

//Функция, отключающая от сокета
function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

//Функция, отправляющая объект с данными сообщения в /app/message-details
function sendMessage() {
    const date = new Date().toLocaleTimeString();
    const usernameInput = document.getElementById("name");
    var username;
    if (usernameInput.value !== '') {
        username = usernameInput.value;
    } else {
        username = "Гость";
    }
    stompClient.send("/app/message-details", {}, JSON.stringify({
        'username': username,
        'text': $("#text-to-send").val(), 'date': date
    }));
    $('#text-to-send').val('');
}

//Функция, вставляющая сообщение в тело чата и скроллящее в самый низ чата
function showMessage(message) {
    var txt = window.getSelection().toString();
    $("#chatBody").append("<tr><td>" + message.content + txt + /*"<img src='" + $("#image-selector").src + "'>"*/"</td></tr>");
    $("#chat-div").scrollTop($("#chat-div")[0].scrollHeight);
}

function addMark(num) {
    const textarea = document.getElementById("text-to-send");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const str = textarea.value;
    const str1 = str.substring(0, start);
    const str2 = str.substring(start, end);
    const str3 = str.substring(end);
    switch (num) {
        case 1:
            textarea.value = str1 + "<b>" + str2 + "</b>" + str3;
            break;
        case 2:
            textarea.value = str1 + "<i>" + str2 + "</i>" + str3;
            break;
        case 3:
            textarea.value = str1 + "<s>" + str2 + "</s>" + str3;
            break;
    }
}

//Функция, содержащая функции при взаимодействии с кнопками
$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function () {
        connect();
    });
    $("#disconnect").click(function () {
        disconnect();
    });
    $("#send").click(function () {
        sendMessage();
    });
    $("#bold").click(function () {
        addMark(1);
    });
    $("#idiomatic").click(function () {
        addMark(2);
    });
    $("#strike").click(function () {
        addMark(3);
    });
});