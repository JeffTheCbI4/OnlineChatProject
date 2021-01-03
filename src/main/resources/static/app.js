var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#chat").show();
    }
    else {
        $("#chat").hide();
    }
    $("#chatBody").html("");
}

function connect() {
    var socket = new SockJS('/chat-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/messages', function (message) {
            showMessage(JSON.parse(message.body).content);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    var date = new Date().toLocaleTimeString();
    stompClient.send("/app/message-details", {}, JSON.stringify({'username': $("#name").val(),
        'text': $("#text-to-send").val(), 'date': date}));
    $('#text-to-send').val('');
}

function showMessage(message) {
    $("#chatBody").append("<tr><td>" + message + "</td></tr>");
    $('#chat-div').scrollTop($('#chat-div')[0].scrollHeight);
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendMessage(); });
});