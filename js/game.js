var socket = new SockJS('http://localhost:9000/Snake', undefined, {debug:false})
var stompClient = Stomp.over(socket)
var gameStarted = false;
var died = false;
var gameLoop;
var snakeSize = 10; 
var direction = "down";
var ctx = mycanvas.getContext('2d');
var snakePlayers = [];

var food = {x: -1, y: -1};

var background = new Image(); //playfield screen
background.src = "https://media.discordapp.net/attachments/605158966455959572/654823353139462144/abi-merrell-bar-background.png?width=782&height=676";
var backgroundGameOver = new Image(); //gameover screen
backgroundGameOver.src = "https://media.discordapp.net/attachments/605158966455959572/656272876239978546/game_over_the_best.png";

    
var url = new URL(window.location);
var gameId = url.searchParams.get("id")

btn.addEventListener("click", function(){
    
    var f = {
        x: Math.floor((Math.random() * 30) + 1),
        y: Math.floor((Math.random() * 30) + 1),
        type: "FOOD"
    }

    stompClient.send('/app/game/'+gameId,{},JSON.stringify({'type':"SETFOOD",'message':f}))

    var snakePlayer = {"player": sessionStorage.getItem("user"),"snake": [{"x":3,"y":0,"type":"SNAKEBODY"},{"x":2,"y":0,"type":"SNAKEBODY"},{"x":1,"y":0,"type":"SNAKEBODY"},{"x":0,"y":0,"type":"SNAKEBODY"}]}
    stompClient.send('/app/game/'+gameId,{},JSON.stringify({'type':"STARTGAME",'message':snakePlayer}))
});


stompClient.connect({}, function(frame) {

    stompClient.subscribe('/topic/game/'+gameId, function(message) {
        var msg = JSON.parse(message.body);
        if (msg.type == "STARTGAME") {
            snakePlayers = msg.message
            gameStarted = true;
            init();
        } else if (msg.type == "DRAW") {
            drawBackground();
            drawFood();
            snakePlayers = msg.message;
            for (let i = 0; i < snakePlayers.length; i++) {
                const snake = snakePlayers[i].snake;
                drawSnake(snake)
            }
        } else if (msg.type == "SETFOOD" || msg.type == "GETFOOD") {
            food = msg.message;
            drawFood();
        } else if (msg.type == "PATHFIND"){
            // alert(JSON.stringify(msg.message))
        }
    })
    
})

function move() {

    console.log(snakePlayers)

    var user = JSON.parse(sessionStorage.getItem("user"));

    var snake = snakePlayers.find(x => x.player.username == user.username).snake;

    var snakeX = snake[0].x;
    var snakeY = snake[0].y;

    if (direction == 'right') { 
        snakeX++; 
    } else if (direction == 'left') { 
        snakeX--; 
    } else if (direction == 'up') { 
        snakeY--; 
    } else if(direction == 'down') { 
        snakeY++; 
    }

    //Collision detection with walls and itself
    if (snakeX == -1 || snakeX == w/snakeSize || snakeY == -1 || snakeY == h/snakeSize || checkCollision({snakeX, snakeY})) {
        //restart game
        btn.removeAttribute('disabled', true);
        ctx.drawImage(backgroundGameOver,0,0,w,h);
        // ctx.clearRect(0,0,w,h);
        gameLoop = clearInterval(gameLoop);
        return;          
    } if(snakeX == food.x && snakeY == food.y) {
        var tail = {x: snakeX, y: snakeY}; //Create a new head instead of moving the tail
        createFood(); //Create new food
        drawFood(); 
        PathFind();
    }

    else {
        var tail = snake.pop(); 
        tail.x = snakeX; 
        tail.y = snakeY;
      }
    
      snake.unshift(tail);

    var player = snakePlayers.find(x => x.player.username == user.username);


    stompClient.send('/app/game/'+gameId,{},JSON.stringify({'type':"DRAW",'message':player}))
}

function PathFind() {
    var user = JSON.parse(sessionStorage.getItem("user"));
    var player = snakePlayers.find(x => x.player.username == user.username);
    stompClient.send('/app/game/'+gameId,{},JSON.stringify({'type':"PATHFIND",'message':player}))
    // alert();
}

function checkCollision(location) {
    for (let i = 0; i < snakePlayers.length; i++) {
        const snake = snakePlayers[i].snake;
        for (let j = 0; j < snake.length; j++) {
            const element = snake[j];
            if (element.x === location.snakeX && element.y === location.snakeY) {
                return true
            }
        }
    }
    return false;
}

function drawSnake(snake) {
    for (let i = 0; i < snake.length; i++) {
        const element = snake[i];

        ctx.fillStyle = 'green';
		ctx.fillRect(element.x*snakeSize, element.y*snakeSize, snakeSize, snakeSize);
		ctx.strokeStyle = 'darkgreen';
		ctx.strokeRect(element.x*snakeSize, element.y*snakeSize, snakeSize, snakeSize);
    }
}

function drawBackground() {
    ctx.drawImage(background, 0, 0, w, h);
}

function createFood() {
    var f = {
        x: Math.floor((Math.random() * 30) + 1),
        y: Math.floor((Math.random() * 30) + 1),
        type: "FOOD"
    }


    var user = JSON.parse(sessionStorage.getItem("user"))


    var snake = getSnakePlayerByUsername(user.username).snake;

    for (var i=0; i> snake.length; i++) {
        var snakeX = snake[i].x;
        var snakeY = snake[i].y;

        if (f.x===snakeX && f.y === snakeY || f.y === snakeY && f.x===snakeX) {
            f.x = Math.floor((Math.random() * 30) + 1);
            f.y = Math.floor((Math.random() * 30) + 1);
        }
    }

    stompClient.send('/app/game/'+gameId,{},JSON.stringify({'type':"SETFOOD",'message':f}))

    var food = f;

    drawFood();
}

function drawFood() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(food.x*snakeSize, food.y*snakeSize, snakeSize, snakeSize);
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x*snakeSize+1, food.y*snakeSize+1, snakeSize-2, snakeSize-2);
}

function getSnakePlayerByUsername(username) {
    for (let i = 0; i < snakePlayers.length; i++) {
        const snakeplayer = snakePlayers[i];
        if(snakeplayer.player.username === username) {
            return snakeplayer;
        }
    }
    return undefined;
}

function init() {
    clearInterval(gameLoop)
    gameLoop = setInterval(move, 100)
}

document.onkeydown = function(event) {

    keyCode = window.event.keyCode; 
    keyCode = event.keyCode;

    switch(keyCode) {

        case 37: 
        if (direction != 'right') {
            direction = 'left'; 
            console.log('left'); 
        }
        break;

        case 39:
        if (direction != 'left') {
            direction = 'right';
            console.log('right');
        }
        break;

        case 38:
        if (direction != 'down') {
            direction = 'up';
            console.log('up');
        }
        break;

        case 40:
        if (direction != 'up') {
            direction = 'down';
            console.log('down');
        }
        break;
    }
}