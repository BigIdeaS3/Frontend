var gameId;
var stompClient;

function getLobbyId() {
    var url = new URL(window.location)
    gameId = url.searchParams.get("id")
    console.log(gameId)

    listenToServer(gameId)
}

function listenToServer(gameId) {
    var socket = new SockJS('http://localhost:9000/Snake')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, function(frame) {
        var gameConn = stompClient.subscribe("/topic/game/"+gameId, function(message) {
            var msg = JSON.parse(message.body)
            console.log(msg)
            if (msg.type == "JOIN" || msg.type == "GETALLPLAYERS") {
                addUsersToTable(msg.message)
            } else if (msg.type == "STARTGAME") {
                gameConn.unsubscribe()
                if (msg.message.username == name) {
                    location.href = "index.html?id="+gameId;
                } else {
                    location.href = "index.html?id="+gameId;
                }
            }
        })
        getAllUsers();

    })
}

function getAllUsers() {
    stompClient.send("/app/game/"+gameId, {}, JSON.stringify({'type':"GETALLPLAYERS",'message':""}));
}

function addUsersToTable(users) {
    var table = document.getElementById('users');

    $("#users").find("tr:not(:first)").remove();

    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        
        console.log(users)
        
        var row = table.insertRow(1);
        row.insertCell(0)
        var cUser = row.insertCell(1)

        cUser.innerHTML = element.player.username;
    }
}

function startGame() {
    location.href = "index.html?id=" + gameId;
}