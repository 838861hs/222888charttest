
const backgroundCanvas = document.getElementById('backgroundCanvas');
const backgroundContext = backgroundCanvas.getContext('2d');
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

function drawGrid() {
  backgroundContext.strokeStyle = '#e0e0e0';
  backgroundContext.lineWidth = 1;

  const gridSpacing = 30;
  for (let x = 0; x <= backgroundCanvas.width; x += gridSpacing) {
    backgroundContext.moveTo(x, 0);
    backgroundContext.lineTo(x, backgroundCanvas.height);
  }

  for (let y = 0; y <= backgroundCanvas.height; y += gridSpacing) {
    backgroundContext.moveTo(0, y);
    backgroundContext.lineTo(backgroundCanvas.width, y);
  }

  backgroundContext.stroke();
}

function drawBlueLine() {
let centerX = backgroundCanvas.width / 2;
let centerY = backgroundCanvas.height / 2;
const gridSpacing = 30;
let lineLength = gridSpacing * 6;

let adjustedCenterX = Math.round(centerX / gridSpacing) * gridSpacing;

backgroundContext.strokeStyle = 'blue';
backgroundContext.lineWidth = 2;

backgroundContext.beginPath();
backgroundContext.moveTo(adjustedCenterX - lineLength / 2, centerY);
backgroundContext.lineTo(adjustedCenterX + lineLength / 2, centerY);
backgroundContext.stroke();
}
function drawDot() {
let centerX = backgroundCanvas.width / 2;
let centerY = backgroundCanvas.height / 2;
const gridSpacing = 30;

let adjustedCenterX = Math.round(centerX / gridSpacing) * gridSpacing;

backgroundContext.fillStyle = 'red'; // 点の色を赤に設定します
backgroundContext.beginPath();
backgroundContext.arc(adjustedCenterX, centerY - gridSpacing * 2, 5, 0, 2 * Math.PI); // 点の半径を5に設定します
backgroundContext.fill();
}

drawGrid();
drawBlueLine();
drawDot();

let isEraser = false;
let isDrawing = false;
let lastX, lastY;

document.getElementById('toggleEraser').addEventListener('click', function() {
  isEraser = !isEraser;
  this.innerText = isEraser ? 'ペンモード' : '消しゴムモード';
});

canvas.addEventListener('mousedown', function(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

function draw(e) {
  if(!isDrawing) return;
  context.lineWidth = isEraser ? 10 : 5;
  context.lineCap = 'round';
  context.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
  
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();

  [lastX, lastY] = [e.offsetX, e.offsetY];
}
