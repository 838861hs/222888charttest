const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const step = 30;

let lastDropPoint = { x: 0, y: 0 };
let lines = [];
let isMagnifierOn = false;

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

//拡大鏡の関数
document.getElementById('magnifierButton').addEventListener('click', () => {
  isMagnifierOn = !isMagnifierOn;
});

let isDrawing = false;
let startX = 0;
let startY = 0;

function handleStart(e) {
    // タッチイベントの場合、最初のタッチポイントの座標を取得
    if (e.type === 'touchstart') {
        e.preventDefault(); // デフォルトのタッチイベントの動作をキャンセル
        const touch = e.touches[0];
        e.offsetX = touch.clientX - touch.target.offsetLeft;
        e.offsetY = touch.clientY - touch.target.offsetTop;
    }

    isDrawing = true;
    const closestPoint = getClosestGridPoint(e.offsetX, e.offsetY);
    if (lastDropPoint.x !== 0 || lastDropPoint.y !== 0) {
        startX = lastDropPoint.x;
        startY = lastDropPoint.y;
    } else {
        startX = closestPoint.x;
        startY = closestPoint.y;
    }
}


function handleMove(e) {
  // タッチイベントの場合、最初のタッチポイントの座標を取得
  if (e.type === 'touchmove') {
    e.preventDefault();
    const touch = e.touches[0];
    e.offsetX = touch.clientX - touch.target.offsetLeft;
    e.offsetY = touch.clientY - touch.target.offsetTop;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawLines();

  if (isDrawing === true) {
    drawLine(e);
  } else if (isMagnifierOn) {
    showMagnifier(e);
  }
}
function drawLine(e) {
  const closestPoint = getClosestGridPoint(e.offsetX, e.offsetY);
  ctx.beginPath();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.moveTo(startX, startY);
  ctx.lineTo(closestPoint.x, closestPoint.y);
  ctx.stroke();
}
function showMagnifier(e) {
  const magnifierRadius = 100;
  const magnification = 2;

  const sourceX = e.offsetX - magnifierRadius / magnification;
  const sourceY = e.offsetY - magnifierRadius / magnification;
  const sourceWidth = magnifierRadius * 2 / magnification;
  const sourceHeight = magnifierRadius * 2 / magnification;

  const magnifierCanvas = document.createElement('canvas');
  const magnifierCtx = magnifierCanvas.getContext('2d');
  magnifierCanvas.width = sourceWidth;
  magnifierCanvas.height = sourceHeight;

  magnifierCtx.drawImage(
      canvas,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      sourceWidth,
      sourceHeight
  );

  ctx.save();
  ctx.beginPath();
  ctx.arc(e.offsetX, e.offsetY, magnifierRadius, 0, 2 * Math.PI);
  ctx.clip();
  ctx.drawImage(
      magnifierCanvas,
      0,
      0,
      sourceWidth,
      sourceHeight,
      e.offsetX - magnifierRadius,
      e.offsetY - magnifierRadius,
      sourceWidth * magnification,
      sourceHeight * magnification
  );
  ctx.restore();
}


function handleEnd(e) {
  // タッチイベントの場合、最後のタッチポイントの座標を取得
  if (e.type === 'touchend') {
      e.preventDefault(); // デフォルトのタッチイベントの動作をキャンセル
      const touch = e.changedTouches[0];
      e.offsetX = touch.clientX - touch.target.offsetLeft;
      e.offsetY = touch.clientY - touch.target.offsetTop;
  }

  if (isDrawing === true) {
      const closestPoint = getClosestGridPoint(e.offsetX, e.offsetY);
      lines.push({ startX: startX, startY: startY, endX: closestPoint.x, endY: closestPoint.y });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      drawLines();
      isDrawing = false;
      lastDropPoint = closestPoint;
  }
}

document.getElementById('resetButton').addEventListener('click', () => {
    lines = [];
    lastDropPoint = { x: 0, y: 0 };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
});

canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('touchstart', handleStart);
canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('touchmove', handleMove);
canvas.addEventListener('mouseup', handleEnd);
canvas.addEventListener('touchend', handleEnd);
drawGrid();
