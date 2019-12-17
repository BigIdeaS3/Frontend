var stompClient;

function connect() {
    var socket = new SockJS('http://localhost:9000/SnakeMP')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, function(frame) {
        stompClient.subscribe('/topic/lobbies', function(message) {
            var msg = JSON.parse(message.body)
            if(msg.type == "CONNECT") {
                console.log(msg.message)
                
                addLobbiesToTable(msg.message)
            } else if (msg.type == "CREATE") {
                addLobbiesToTable(msg.message)
            }
        })
        stompClient.send('/app/lobbies',{},JSON.stringify({'type':'CONNECT','message':''}))
    })
}

function addLobbiesToTable(lobbies) {
    var table = document.getElementById('lobbies');

    for (let i = lobbies.length; i > 0; i--) {
        const element = lobbies[i];
        
        var row = table.insertRow(1);
        row.insertCell(0)
        var cName = row.insertCell(1)
        var cCount = row.insertCell(2)
        var cConnect = row.insertCell(3)

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

function join(gameId) {
    gameId = gameId -1
    console.log("/app/game/"+gameId)


    stompClient.subscribe("/app/game/"+gameId, function(message) {
        var msg = JSON.parse(message.body);
        console.log(msg)
    })

    stompClient.send("/app/game/"+gameId,{}, JSON.stringify({'type':"JOIN",'message':name}))
}

function createLobby() {
    stompClient.send("/app/lobbies",{},JSON.stringify({'type':'CREATE','message':name}))
}