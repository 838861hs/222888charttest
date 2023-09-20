const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const step = 30;

let lastDropPoint = { x: 0, y: 0 };
let lines = [];


function drawGrid() {
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
  }
}

function getClosestGridPoint(x, y) {
    const closestX = Math.round(x / step) * step;
    const closestY = Math.round(y / step) * step;
    return { x: closestX, y: closestY };
}

function drawLines() {
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;

  for (let line of lines) {
      ctx.beginPath();
      ctx.moveTo(line.startX, line.startY);
      ctx.lineTo(line.endX, line.endY);
      ctx.stroke();
  }
}



let isDrawing = false;
let startX = 0;
let startY = 0;

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  const closestPoint = getClosestGridPoint(e.offsetX, e.offsetY);
  if (lastDropPoint.x !== 0 || lastDropPoint.y !== 0) {
      startX = lastDropPoint.x;
      startY = lastDropPoint.y;
  } else {
      startX = closestPoint.x;
      startY = closestPoint.y;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDrawing === true) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      drawLines();
      const closestPoint = getClosestGridPoint(e.offsetX, e.offsetY);
      ctx.beginPath();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.moveTo(startX, startY);
      ctx.lineTo(closestPoint.x, closestPoint.y);
      ctx.stroke();
  }
});


canvas.addEventListener('mouseup', (e) => {
  if (isDrawing === true) {
      const closestPoint = getClosestGridPoint(e.offsetX, e.offsetY);
      lines.push({ startX: startX, startY: startY, endX: closestPoint.x, endY: closestPoint.y });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      drawLines();
      isDrawing = false;
      lastDropPoint = closestPoint;
  }
});

document.getElementById('resetButton').addEventListener('click', () => {
  lines = [];
  lastDropPoint = { x: 0, y: 0 };
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
});

drawGrid();
