var stompClient;
var lobbyConn;

function connect() {
    var socket = new SockJS('http://localhost:9000/Snake')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, function(frame) {
        lobbyConn = stompClient.subscribe('/topic/lobbies', function(message) {
            var msg = JSON.parse(message.body)
            if(msg.type == "CONNECT") {
                console.log(msg.message)
                
                addLobbiesToTable(msg.message)
            } else if (msg.type == "CREATE") {
                addLobbytoTable(msg.message)
            }
        })
        stompClient.send('/app/lobbies',{},JSON.stringify({'type':'CONNECT','message':''}))
    })
}

function addLobbiesToTable(lobbies) {
    var table = document.getElementById('lobbies');

    $("#lobbies").find("tr:not(:first)").remove();

    


    for (let i = lobbies.length; i > 0; i--) {
        const element = lobbies[i];
        
        var row = table.insertRow(1);
        var cName = row.insertCell(0)
        var cCount = row.insertCell(1)
        var cConnect = row.insertCell(2)

        cName.innerHTML = "Lobby " + i;
        cCount.innerHTML = lobbies[i-1].connectedPlayers.length;

        var btn = document.createElement('input')
        btn.type = "button";
        btn.className = "connect"
        btn.value = "Connect to lobby " + i
        btn.onclick = (function(i) {return function() {join(i);}})(i);

        cConnect.appendChild(btn)
    }
}


function addLobbytoTable(lobby) {
    var table = document.getElementById('lobbies');

    var rows = table.tBodies[0].rows.length;

    console.log(lobby)

        
    var row = table.insertRow(rows);
    var cName = row.insertCell(0)
    var cCount = row.insertCell(1)
    var cConnect = row.insertCell(2)

    cName.innerHTML = "Lobby " + rows;
    cCount.innerHTML = lobby.connectedPlayers.length;

    var btn = document.createElement('input')
    btn.type = "button";
    btn.className = "connect"
    btn.value = "Connect to lobby " + rows
    btn.onclick = (function(rows) {return function() {join(rows);}})(rows);

    cConnect.appendChild(btn)
}

function join(gameId) {
    gameId = gameId -1
    console.log("/topic/game/"+gameId)

    lobbyConn.unsubscribe()

    var gameConn = stompClient.subscribe("/topic/game/"+gameId, function(message) {
        var msg = JSON.parse(message.body);
        var destination = message.headers.destination
        var split = destination.split("/")
        console.log(split)

        if(msg.type == "JOIN") {
            if (msg.message !== null) {
                gameConn.unsubscribe();
                location.href = "lobby.html?id="+split[3]
            } else {
                alert ("You already joined this lobby")
            }
        }
    })

    stompClient.send("/app/game/"+gameId,{}, JSON.stringify({'type':"JOIN",'message':name}))
}

function createLobby() {
    stompClient.send("/app/lobbies",{},JSON.stringify({'type':'CREATE','message':name}))
}