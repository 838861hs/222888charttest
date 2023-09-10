// ===================== グリッドを描画 =====================
const bgCanvas = document.getElementById('backgroundCanvas');
const bgCtx = bgCanvas.getContext('2d');
const gridSize = 30;

function drawGrid() {
  bgCtx.strokeStyle = "#e0e0e0";
  bgCtx.lineWidth = 1;
  for (let i = 0; i <= bgCanvas.width; i += gridSize) {
      bgCtx.beginPath();
      bgCtx.moveTo(i, 0);
      bgCtx.lineTo(i, bgCanvas.height);
      bgCtx.stroke();
  }
  for (let j = 0; j <= bgCanvas.height; j += gridSize) {
      bgCtx.beginPath();
      bgCtx.moveTo(0, j);
      bgCtx.lineTo(bgCanvas.width, j);
      bgCtx.stroke();
  }
}

// ===================== 三角形を初期位置描画 =====================
const triCanvas = document.getElementById('triangleCanvas');
const triCtx = triCanvas.getContext('2d');
let draggable = true;
let staticTriangles = [];
let staticTriangle = null;
const blueLineStartX = Math.floor(bgCanvas.width / 2 / gridSize - 3) * gridSize;
const blueLineEndX = blueLineStartX + 6 * gridSize;
const blueLineY = bgCanvas.height / 2 + 2 * gridSize;
const point = {
  x: blueLineStartX + 3 * gridSize,
  y: blueLineY - 2 * gridSize,
  radius: 5,
  isDragging: false
};

function drawDynamicTriangle() {
  triCtx.fillStyle = 'rgba(0, 173, 239, 0.5)';
  triCtx.beginPath();
  triCtx.moveTo(blueLineStartX, blueLineY);
  triCtx.lineTo(blueLineEndX, blueLineY);
  triCtx.lineTo(point.x, point.y);
  triCtx.closePath();
  triCtx.fill();
}

function drawStaticTriangles() {
  triCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  for (let triangle of staticTriangles) {
      triCtx.beginPath();
      triCtx.moveTo(blueLineStartX, blueLineY);
      triCtx.lineTo(blueLineEndX, blueLineY);
      triCtx.lineTo(triangle.x, triangle.y);
      triCtx.closePath();
      triCtx.fill();
  }
}

function drawBlueLine() {
  bgCtx.strokeStyle = "#0000FF";
  bgCtx.lineWidth = 2;
  bgCtx.beginPath();
  bgCtx.moveTo(blueLineStartX, blueLineY);
  bgCtx.lineTo(blueLineEndX, blueLineY);
  bgCtx.stroke();
}

function drawDraggablePoint() {
  triCtx.fillStyle = "#FF0000";
  triCtx.beginPath();
  triCtx.arc(point.x, point.y, point.radius, 0, 2 * Math.PI);
  triCtx.fill();
}

function drawBackground() {
  triCtx.clearRect(0, 0, triCanvas.width, triCanvas.height);
  drawGrid();
  drawBlueLine();
  drawStaticTriangles();
  drawDynamicTriangle();
  drawDraggablePoint();
}

//再描画する時に呼び出す関数。
function draw(){
  drawBackground();
}
draw();
// ===================== イベントリスナー =====================
// triCanvas.addEventListener('mousedown', function(e) {
//   let rect = triCanvas.getBoundingClientRect();
//   let x = e.clientX - rect.left;
//   let y = e.clientY - rect.top;

//   if (draggable) {
//       let dx = point.x - x;
//       let dy = point.y - y;
//       if (dx * dx + dy * dy <= point.radius * point.radius) {
//           point.isDragging = true;
//       }
//   } else {
//       triCtx.beginPath();
//       triCtx.moveTo(x, y);
//   }
// });

triCanvas.addEventListener('mousemove', function(e) {
  let rect = triCanvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  if (point.isDragging && draggable) {
      point.x = x;
      point.y = y;
      draw();
  } else if (!draggable) {
      triCtx.lineTo(x, y);
      triCtx.stroke();
  }
});

triCanvas.addEventListener('mouseup', function(e) {
    if (point.isDragging && draggable) {
        point.x = Math.round(point.x / gridSize) * gridSize;
        point.y = Math.round(point.y / gridSize) * gridSize;

        if (Math.abs(point.y - blueLineY) === 4 * gridSize) {
            staticTriangles.push({ x: point.x, y: point.y });
        }

        point.isDragging = false;
        draw();
    }
});


// ===================== drawレイヤーの処理 =====================

const drawCanvas = document.getElementById('drawingCanvas');
const drawCtx = drawCanvas.getContext('2d');


let isDrawing = false;
let isEraser = false;
let lastX, lastY;

document.getElementById('toggleEraser').addEventListener('click', function() {
  isEraser = !isEraser;
  this.innerText = isEraser ? 'ペンモード' : '消しゴムモード';
});

drawCanvas.addEventListener('mousedown', function(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

drawCanvas.addEventListener('mousemove', userDraws);
drawCanvas.addEventListener('mouseup', () => isDrawing = false);
drawCanvas.addEventListener('mouseout', () => isDrawing = false);

function userDraws(e) {
  if(!isDrawing) return;
  drawCtx.lineWidth = isEraser ? 10 : 5;
  drawCtx.lineCap = 'round';
  drawCtx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
  
  drawCtx.beginPath();
  drawCtx.moveTo(lastX, lastY);
  drawCtx.lineTo(e.offsetX, e.offsetY);
  drawCtx.stroke();

  [lastX, lastY] = [e.offsetX, e.offsetY];
}




