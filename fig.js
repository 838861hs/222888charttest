let backgroundCanvas = document.getElementById('backgroundCanvas');
let backgroundContext = backgroundCanvas.getContext('2d');
let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');

let isBackgroundEditMode = false;
let isEraser = false;
let isDrawing = false;
let lastX, lastY;

let dotX = 400; // 点の初期X座標
let dotY = 270; // 点の初期Y座標（青い線の中心から2マス上）
let draggingDot = null;

document.getElementById('toggleEraser').addEventListener('click', function() {
  isEraser = !isEraser;
  this.innerText = isEraser ? 'ペンモード' : '消しゴムモード';
});

document.getElementById('toggleMode').addEventListener('click', function() {
  isBackgroundEditMode = !isBackgroundEditMode;
  this.innerText = isBackgroundEditMode ? '絵描きモード' : '背景編集モード';
});

canvas.addEventListener('mousedown', function(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  draw(e);
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseout', endDrawing);

function draw(e) {
  if(!isDrawing) return;

  if(isBackgroundEditMode) {
    let x = e.offsetX;
    let y = e.offsetY;

    if(e.type === 'mousedown') {
      if(Math.abs(x - dotX) < 5 && Math.abs(y - dotY) < 5) {
        draggingDot = { x: dotX, y: dotY };
      }
    } else if(e.type === 'mousemove' && draggingDot) {
      dotX = x;
      dotY = y;
      redrawBackground();
    } else if(e.type === 'mouseup' || e.type === 'mouseout') {
      draggingDot = null;
    }

    return;
  }

  context.lineWidth = isEraser ? 10 : 5;
  context.lineCap = 'round';
  context.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
  
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();

  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function endDrawing() {
  isDrawing = false;
  draggingDot = null;
}

function redrawBackground() {
  backgroundContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
  drawGrid();
  drawBlueLine();
  drawDot();
}

function drawDot() {
  backgroundContext.fillStyle = 'red'; 
  backgroundContext.beginPath();
  backgroundContext.arc(dotX, dotY, 5, 0, 2 * Math.PI); 
  backgroundContext.fill();
}

function drawGrid() {
  backgroundContext.strokeStyle = '#e0e0e0';
  backgroundContext.lineWidth = 1;

  var gridSpacing = 30;
  for (var x = 0; x <= backgroundCanvas.width; x += gridSpacing) {
    backgroundContext.moveTo(x, 0);
    backgroundContext.lineTo(x, backgroundCanvas.height);
  }

  for (var y = 0; y <= backgroundCanvas.height; y += gridSpacing) {
    backgroundContext.moveTo(0, y);
    backgroundContext.lineTo(backgroundCanvas.width, y);
  }

  backgroundContext.stroke();
}
// drawGrid と drawBlueLine 関数はここに追加します
