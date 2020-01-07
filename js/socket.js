var stompClient;

var game;

function connect() {
    var socket = new SockJS('http://localhost:9000/Snake')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, function(frame) {
        stompClient.subscribe('/topic/lobbies', function(message) {
            var msg = JSON.parse(message.body)
            if(msg.type == "CREATE") {
            gameId = msg.message;
                stompClient.subscribe('/topic/game/'+gameId, function(message) {
                    var msg = JSON.parse(message.body)
                    if(msg.type == "STARTDRAWING") {
                        context.beginPath();
                        context.moveTo(msg.message.locX,msg.message.locY)
                    }  else if(msg.type == "DRAW") {
                        context.lineTo(msg.message.locX,msg.message.locY)
                        context.stroke();
                    } 
                })
            }
        })

        stompClient.send('/app/lobbies',{},JSON.stringify({'type':'CREATE','message':'Rene'}))




        // stompClient.send('/app/lobbies',{},JSON.stringify({'type':'CONNECT','message':''}))

    })
}


function unsubscribeToGame(id) {
    game.unsubscribe()
}

function startDrawing(x,y) {
    stompClient.send("/app/game/"+gameId,{},JSON.stringify({'type':'STARTDRAWING','message':{'locX':x,'locY':y}}))
}

function draw(x,y) {
    stompClient.send("/app/game/"+gameId,{},JSON.stringify({'type':"DRAW",'message':{'locX':x,'locY':y}}))
}
