var socket = new SockJS('http://localhost:9000/Snake')
var stompClient = Stomp.over(socket)
var gameStarted = false;
var died = false;
var gameLoop;
var snakeSize = 10; 
var direction = "down";
var ctx = mycanvas.getContext('2d');
var snakePlayers;


    
var url = new URL(window.location);
var gameId = url.searchParams.get("id")

btn.addEventListener("click", function(){
    var snakePlayer = {"player": localStorage.getItem("user"),"snake": [{"x":3,"y":0},{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":0}]}
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
            snakePlayers = msg.message;
            for (let i = 0; i < snakePlayers.length; i++) {
                const snake = snakePlayers[i].snake;
                drawSnake(snake)
            }
        }
    })
    
    // stompClient.subscribe('/topic/game/'+gameId, function(message) {
    // 	var msg = JSON.parse(message.body);
    // 	if (msg.type == "DRAW") {
    // 		paint()
    // 		snakes = []
    // 		if(Array.isArray(msg.message) && !Array.isArray(msg.message[0])) {
    // 			snakes.push(msg.message)
    // 		} else if(Array.isArray(msg.message) && Array.isArray(msg.message[0])) {
    // 			snakes = msg.message;
    // 		}

    // 		for (let i = 0; i < snakes.length; i++) {
    // 			const snake = snakes[i];
    // 			for (let j = 0; j < snake.length; j++) {
    // 				const element = snake[j];
    // 				bodySnake(element.x,element.y)
    // 			}
    // 		}


    // 		// for (let i = 0; i < msg.message.length; i++) {
    // 		// 	const ele = msg.message[i];
    // 		// 	if (Array.isArray(ele)) {
    // 		// 	snakes = ele;
    // 		// 	for (let i = 0; i < snakes.length; i++) {
    // 		// 		const element = snakes[i];
    // 		// 			bodySnake(element.x, element.y);
    // 		// 		}
    // 		// 	} else {
    // 		// 		bodySnake(ele.x, ele.y);
    // 		// 	}
    // 		// }
    // 	}
    // })
})

function move() {
    //TODO: Get snake by username in response and localstorage user

    var snake = {};

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
    if (snakeX == -1 || snakeX == w/snakeSize || snakeY == -1 || snakeY == h/snakeSize || checkCollision(snakeX, snakeY, snake)) {
        //restart game
        btn.removeAttribute('disabled', true);
        ctx.drawImage(backgroundGameOver,0,0,w,h);
        // ctx.clearRect(0,0,w,h);
        gameloop = clearInterval(gameloop);
        return;          
    } 
    //No collisions found, move forward
    else {
        var tail = snake[snake.length-1];
        tail.x = snakeX;
        tail.y = snakeY;

        for (let i = snake.length-2; i >= 0; i--) {
            const element = snake[i];
            snake[i+1] = element;
        }

        snake[0] = tail
    }

    //TODO: Get your own snakeplayer from session and send it to the server
    //      DONT SEND ALL SNAKEPLAYERS!!! RENE



}

function checkCollision(location) {
    for (let i = 0; i < snakePlayers.length; i++) {
        const snake = snakePlayers[i].snake;
        for (let j = 0; j < snake.length; j++) {
            const element = snake[j];
            if (element.x === location.x && element.y === location.y) {
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
    var food = {
        x: Math.floor((Math.random() * 30) + 1),
        y: Math.floor((Math.random() * 30) + 1)
    }

    //TODO: Get snake by username in response and localstorage user

    var user = JSON.parse(localStorage.getItem("user"))

    alert(JSON.stringify(user))

    var snake = getSnakePlayerByUsername(user.username).snake;

    for (var i=0; i> snake.length; i++) {
        var snakeX = snake[i].x;
        var snakeY = snake[i].y;

        if (food.x===snakeX && food.y === snakeY || food.y === snakeY && food.x===snakeX) {
            food.x = Math.floor((Math.random() * 30) + 1);
            food.y = Math.floor((Math.random() * 30) + 1);
        }
    }


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
    createFood();
    gameLoop = setInterval(move, 1000)
}