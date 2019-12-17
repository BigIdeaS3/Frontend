
var drawModule = (function () {

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
      snake = [];
      for (var i = length-1; i>=0; i--) {
          snake.push({x:i, y:0});
      }  
  }
  var bgscore1 = null;

  var bgscore = function(){
      //  if(score >= 3){
      // ctx.drawImage(backgroundbar1,0,0,w,h)}
      // else if(score > 5){
      //   ctx.drawImage(backgroundbar2,0,0,w,h)}
      // else if (score > 7){
      //   ctx.drawImage(backgroundbar3,0,0,w,h)
      // }
      score = bgscore1;
      var score = "0"
      switch(score) {
        case 1:
          ctx.drawImage(backgroundbar1,0,0,w,h)
          break;
        case 2:
          ctx.drawImage(backgroundbar2,0,0,w,h)
          break;
        case 3:
          ctx.drawImage(backgroundbar2,0,0,w,h)
          break;
      }

  }
    
  var paint = function(){
        ctx.drawImage(background, 0, 0, w, h);
      // ctx.fillStyle = 'black';
      // ctx.fillRect(0, 0, w, h);
      // ctx.strokeStyle = 'white';
      // ctx.strokeRect(0, 0, w, h);

      btn.setAttribute('disabled', true);

      var snakeX = snake[0].x;
      var snakeY = snake[0].y;

      if (direction == 'right') { 
        snakeX++; }
      else if (direction == 'left') { 
        snakeX--; }
      else if (direction == 'up') { 
        snakeY--; 
      } else if(direction == 'down') { 
        snakeY++; }

      

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
          bgscore1++;
          // bgscore();
          createFood(); //Create new food
        } else {
          var tail = snake.pop(); 
          tail.x = snakeX; 
          tail.y = snakeY;
        }
      
        snake.unshift(tail);

        for(var i = 0; i < snake.length; i++) {
          bodySnake(snake[i].x, snake[i].y);
        } 
        
        drink(food.x, food.y); 
        scoreText();
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
  }

  var checkCollision = function(x, y, array) {
      for(var i = 0; i < array.length; i++) {
        if(array[i].x === x && array[i].y === y)
        return true;
      } 
      return false;
  }

  var init = function(){
      direction = 'down';
      drawSnake();
      createFood();
      gameloop = setInterval(paint, 100);
  }


    return {
      init : init
    };

    
}());
