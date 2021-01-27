var stompClient = null;
var sessionId = "";

//Функция, меняющая состояния кнопок и тела чата при подключении/отключении
function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    var usernameInput = document.getElementById("name");
    if (usernameInput.value === '') {
        usernameInput.value = "Гость";
    }
    $("#name").prop("disabled", connected);
    if (connected) {
        $("#chat").show();
        $("#user-list").show();
    } else {
        $("#chat").hide();
        $("#user-list").empty();
    }
    $("#chatBody").html("");
}

//Функция, создающая сокет чата
function connect() {
    var socket = new SockJS("/chat-websocket");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        var url = stompClient.ws._transport.url;
        url = url.replace("/websocket", "");
        url = url.replace(
            "ws://localhost:8080/chat-websocket/",  "");
        url = url.replace(/^[0-9]+\//, "");
        console.log("Your current session is: " + url);
        sessionId = url;

        setConnected(true);
        console.log("Connected: " + frame);
        stompClient.subscribe("/topic/messages", function (message) {
            showMessage(JSON.parse(message.body));
        });
        stompClient.subscribe("/user/queue/specific-user" + "-user" + sessionId, function (message) {
            showUserList(JSON.parse(message.body));
        });
        stompClient.send("/app/message-details", {}, JSON.stringify({"username": $("#name").val(), "type": "CONNECT"
        }));
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
    const text = document.getElementById("text-to-send").value;
    const imageFile = document.getElementById("image-selector").files[0];
    if (text !== "" || imageFile){
        const username = document.getElementById("name").value;
        const reader = new FileReader();
        //Если отправляют картинку
        reader.onloadend = function (){
            if (reader.result.length > 512000){
                alert("Изображение слишком большое!")
            }
            else {
                stompClient.send("/app/message-details", {}, JSON.stringify({
                    "username": username, "text": text, "type": "CHAT", "image": reader.result
                }));
            }
        }
        if (imageFile){
            reader.readAsDataURL(imageFile);
        }
        else {
            stompClient.send("/app/message-details", {}, JSON.stringify({
                "username": username, "text": text, "type": "CHAT"
            }));
        }
        text.value = "";
    }
}

//Функция, получающая и отображающая список юзеров
function showUserList(message){
    message.forEach(function (item){
        var userlist = document.getElementById("user-list");
        var li = document.createElement("li");
        li.setAttribute("id", item);
        li.appendChild(document.createTextNode(item));
        userlist.appendChild(li);
    })
}

//Функция, вставляющая сообщение в тело чата и скроллящее в самый низ чата
function showMessage(message) {
    const date = new Date().toLocaleTimeString();
    //Сообщение от юзера
    if (message.type === "CHAT"){
        if (message.image === null){
            $("#chatBody").append("<tr><td>" + "[" + date + "] " + message.username + ": " + message.text + "</td></tr>");
        }
        else {
            $("#chatBody").append("<tr><td>" + "[" + date + "] " + message.username + ": " + message.text +
                " <img alt='Изображение' height='100' width='100' src='" + message.image + "'>" + "</td></tr>");
        }
    }
    //Сообщение о подключении юзера и добавление его ника в лист юзеров
    else if (message.type === "CONNECT"){
        $("#chatBody").append("<tr><td><b>" + "[" + date + "] " + "Пользователь " + message.username + " присоединился к чату!</b>" + "</td></tr>");
        var userlist = document.getElementById("user-list");
        var li = document.createElement("li");
        li.setAttribute("id", message.username);
        li.appendChild(document.createTextNode(message.username));
        userlist.appendChild(li);
    }
    //Сообщение об отключении юзера и удаление его ника из листа юзеров
    else if (message.type === "DISCONNECT"){
        $("#chatBody").append("<tr><td><b>" + "[" + date + "] " + "Пользователь " + message.username + " покинул чат." + "</b></td></tr>");
        var userlist = document.getElementById("user-list");
        var li = document.getElementById(message.username);
        userlist.removeChild(li);
    }
    //Скроллит в самый низ чата
    $("#chat-div").scrollTop($("#chat-div")[0].scrollHeight);
}

//Вспомогательная функция, вставляет в между выделенным текстом определенные теги
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
    $("form").on("submit", function (e) {
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

    $("#text-to-send").keypress(function (e) {
        if(e.which === 13 && !e.shiftKey) {
            sendMessage()
            e.preventDefault();
        }
    });
});