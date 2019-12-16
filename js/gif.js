
var width = window.innerWidth;
var height = window.innerHeight;

var templateImage = new Image();

templateImage.src = "https://media.discordapp.net/attachments/605158966455959572/655060836091559961/giphy_10.gif";

function drawKonva(templateImage) {

  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
  });

  var layer = new Konva.Layer();
  stage.add(layer);

  var gif = new SuperGif({
    gif: templateImage,
    progressbar_height: 0,
    auto_play: true,
    loop_mode: true,
    draw_while_loading: true
  });

  gif.load();

  var gif_canvas = gif.get_canvas(); // the lib canvas
  // a copy of this canvas which will be appended to the doc
  var canvas = gif_canvas.cloneNode();
  var context = canvas.getContext('2d');

  function anim(t) { // our animation loop
      context.clearRect(0,0,canvas.width,canvas.height); // in case of transparency ?
      context.drawImage(gif_canvas, 0, 0); // draw the gif frame
      layer.draw();
      requestAnimationFrame(anim);
    
  };

  anim();

  // draw resulted canvas into the stage as Konva.Image
  var image = new Konva.Image({
    image: canvas,
    draggable: true
  });
  layer.add(image);
}