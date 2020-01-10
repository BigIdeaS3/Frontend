var drawModule = (function () {

	var snakes = [];

	var url = new URL(window.location);
	var gameId = url.searchParams.get("id")

	var socket = new SockJS('http://localhost:9000/Snake')
	stompClient = Stomp.over(socket)
	stompClient.connect({}, function(frame) {
		stompClient.subscribe('/topic/game/'+gameId, function(message) {
			var msg = JSON.parse(message.body);
			if (msg.type == "DRAW") {
				paint()
				snakes = []
				if(Array.isArray(msg.message) && !Array.isArray(msg.message[0])) {
					snakes.push(msg.message)
				} else if(Array.isArray(msg.message) && Array.isArray(msg.message[0])) {
					snakes = msg.message;
				}

				for (let i = 0; i < snakes.length; i++) {
					const snake = snakes[i];
					for (let j = 0; j < snake.length; j++) {
						const element = snake[j];
						bodySnake(element.x,element.y)
					}
				}


				// for (let i = 0; i < msg.message.length; i++) {
				// 	const ele = msg.message[i];
				// 	if (Array.isArray(ele)) {
				// 	snakes = ele;
				// 	for (let i = 0; i < snakes.length; i++) {
				// 		const element = snakes[i];
				// 			bodySnake(element.x, element.y);
				// 		}
				// 	} else {
				// 		bodySnake(ele.x, ele.y);
				// 	}
				// }
			}
		})
	})

	var background = new Image(); //playfield screen
	background.src = "https://media.discordapp.net/attachments/605158966455959572/654823353139462144/abi-merrell-bar-background.png?width=782&height=676";
	var backgroundGameOver = new Image(); //gameover screen
	backgroundGameOver.src = "https://media.discordapp.net/attachments/605158966455959572/656272876239978546/game_over_the_best.png";
	var backgroundbar1 = new Image();
	backgroundbar1.src = "https://media.discordapp.net/attachments/605158966455959572/656277363281100810/abi-merrell-bar-background.png";
	var backgroundbar2 = new Image();
	backgroundbar2.src = "https://media.discordapp.net/attachments/605158966455959572/656276563385384970/2.png";
	var backgroundbar3 = new Image();
	backgroundbar3.src = "https://cdn.discordapp.com/attachments/605158966455959572/656276584444985358/3.png";



	var bodySnake = function(x, y) {
		ctx.fillStyle = 'green';
		ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
		ctx.strokeStyle = 'darkgreen';
		ctx.strokeRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
	}

	var drink = function(x, y) {
		ctx.fillStyle = 'yellow';
		ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
		ctx.fillStyle = 'red';
		ctx.fillRect(x*snakeSize+1, y*snakeSize+1, snakeSize-2, snakeSize-2);
	}

	var scoreText = function() {
		var score_text = "Score: " + score;
		ctx.fillStyle = 'red';
		ctx.font = "30px Arial";
		ctx.fillText(score_text, 145, h-5);
	}

	var drawSnake = function() {
		var length = 4;
		snake = [{x:3,y:0},{x:2,y:0},{x:1,y:0},{x:0,y:0}];

		snakes.push(snake)

	}

	var paint = function(){
		ctx.drawImage(background, 0, 0, w, h);
		scoreText();
	}

	var findSnakeInList = function(snake) {
		for (let i = 0; i < snakes.length; i++) {
			const s = snakes[i];
			if (s.length === snake.length) {


				var result = true;
				for (let j = 0; j < s.length; j++) {
					const element = s[j];
					if(s[j].x !== snake[j].x || s[j].y !== snake[j].y) {
						result = false;	
					}
				}
				if (result === true) {
					//alert(JSON.stringify(s))
					return i;
				}
			}
		}
	}

	var move = function() {
		// ctx.fillStyle = 'black';
		// ctx.fillRect(0, 0, w, h);
		// ctx.strokeStyle = 'white';
		// ctx.strokeRect(0, 0, w, h);

		btn.setAttribute('disabled', true);

		var snakeIndex = findSnakeInList(snake)

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


		if (snakeX == -1 || snakeX == w/snakeSize || snakeY == -1 || snakeY == h/snakeSize || checkCollision(snakeX, snakeY, snake)) {
			//restart game
			btn.removeAttribute('disabled', true);
			ctx.drawImage(backgroundGameOver,0,0,w,h);
			// ctx.clearRect(0,0,w,h);
			gameloop = clearInterval(gameloop);
			return;          
		}

		if(snakeX == food.x && snakeY == food.y) {
			var tail = {x: snakeX, y: snakeY}; //Create a new head instead of moving the tail
			score ++;
			createFood(); //Create new food
			drink(food.x, food.y); 
		} else {
			var tail = snake[snake.length-1];
			tail.x = snakeX;
			tail.y = snakeY;

			for (let i = snake.length-2; i >= 0; i--) {
				const element = snake[i];
				snake[i+1] = element;
			}
	
			snake[0] = tail
		}


		snakes[snakeIndex] = snake

		

		// else {
		// 	var tail = snake[snake.length-1];
		// 	snake[snake.length -1] = {}; 
		// 	tail.x = snakeX; 
		// 	tail.y = snakeY;
		// }

		// snake.unshift(tail);

		//TODO: make draw call to server


		stompClient.send('/app/game/'+gameId,{},JSON.stringify({'type':"DRAW",'message':snakes}))

		// stompClient.send('/app/game/'+gameId,{},JSON.stringify({'type':"DRAW",'message':food}))

		// for(var i = 0; i < snake.length; i++) {
		//   bodySnake(snake[i].x, snake[i].y);
		// } 
	}

	var createFood = function() {
		food = {
			x: Math.floor((Math.random() * 30) + 1),
			y: Math.floor((Math.random() * 30) + 1)
		}

		for (var i=0; i>snake.length; i++) {
			var snakeX = snake[i].x;
			var snakeY = snake[i].y;

			if (food.x===snakeX && food.y === snakeY || food.y === snakeY && food.x===snakeX) {
				food.x = Math.floor((Math.random() * 30) + 1);
				food.y = Math.floor((Math.random() * 30) + 1);
			}
		}

		drink(food.x, food.y); 

	}

	var checkCollision = function(x, y, array) {
		for(var i = 0; i < array.length; i++) {
			if(array[i].x === x && array[i].y === y) {
				return true;
			}
		} 
		return false;
	}

	var init = function(){
		direction = 'down';
		drawSnake();
		createFood();
		
		gameloop = setInterval(move, 1000);
	}


	return {
		init : init
	};


}());
