const bgCanvas = document.getElementById('bgCanvas');
const canvas = document.getElementById('myCanvas');
const bgCtx = bgCanvas.getContext('2d');
const ctx = canvas.getContext('2d');
const step = 30;

let currentBgColor = { r: 253, g: 246, b: 200 }; // 現在の背景色（#fdf6c8）
const targetBgColor = { r: 255, g: 255, b: 255 }; // 目標の背景色（#e0e0e0）
const transitionDuration = 300; // トランジションの期間（1秒）
let transitionStartTime;


function animateBackgroundColor(time) {
  if (!transitionStartTime) transitionStartTime = time;
  const elapsed = time - transitionStartTime;

  if (elapsed < transitionDuration) {
      const t = elapsed / transitionDuration;
      const r = currentBgColor.r + (targetBgColor.r - currentBgColor.r) * t;
      const g = currentBgColor.g + (targetBgColor.g - currentBgColor.g) * t;
      const b = currentBgColor.b + (targetBgColor.b - currentBgColor.b) * t;

      bgCtx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
      drawGrid();
      drawH(gridCenterX - 3 * step, gridCenterY - 4 * step);

      requestAnimationFrame(animateBackgroundColor);
  } else {
      currentBgColor = { ...targetBgColor };
      transitionStartTime = null;
  }
}


let lastDropPoint = { x: 0, y: 0 };
let lines = [];
let isMagnifierOn = false;

function drawGrid() {
  bgCtx.strokeStyle = '#e0e0e0';
  bgCtx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += step) {
      bgCtx.beginPath();
      bgCtx.moveTo(x, 0);
      bgCtx.lineTo(x, canvas.height);
      bgCtx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += step) {
      bgCtx.beginPath();
      bgCtx.moveTo(0, y);
      bgCtx.lineTo(canvas.width, y);
      bgCtx.stroke();
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
    startX = closestPoint.x;
    startY = closestPoint.y;

    if (isDrawing) {
      transitionStartTime = null;
      requestAnimationFrame(animateBackgroundColor);
    }
}



function drawLine(e) {
    const currentClosestPoint = getClosestGridPoint(e.offsetX, e.offsetY);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentClosestPoint.x, currentClosestPoint.y);
    ctx.stroke();
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
  drawLines();

  if (isDrawing === true) {
    drawLine(e);
  } else if (isMagnifierOn) {
    showMagnifier(e);
  }
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
      drawLines();
      isDrawing = false;
      
  }
}

document.getElementById('resetButton').addEventListener('click', () => {
  lines = [];
  lastDropPoint = { x: 0, y: 0 };
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  currentBgColor = { r: 253, g: 246, b: 200 };  // currentBgColorを初期の色に戻す
  setInitialBackgroundColor();
});


function drawH(x, y) {
  const width = 2 * step; // 2マス分の太さ
  const height = 8 * step; // Hの高さを8マス分としています。

  bgCtx.lineWidth = 3; // 縁取りの太さを2pxに設定
  bgCtx.strokeStyle = '#000000'; // 縁取りの色を黒に設定

  bgCtx.beginPath();
  bgCtx.moveTo(x, y);
  bgCtx.lineTo(x, y + height);
  bgCtx.stroke();
  
  bgCtx.beginPath();
  bgCtx.moveTo(5*step, 12*step)
  bgCtx.lineTo(7*step, 12*step)
  bgCtx.stroke();

  bgCtx.beginPath();
  bgCtx.moveTo(7*step, 12*step)
  bgCtx.lineTo(7*step, 9*step)
  bgCtx.stroke();

  bgCtx.beginPath();
  bgCtx.moveTo(7*step, 9*step)
  bgCtx.lineTo(11*step, 9*step)
  bgCtx.stroke();

  bgCtx.beginPath();
  bgCtx.moveTo(11*step, 9*step)
  bgCtx.lineTo(11*step, 12*step)
  bgCtx.stroke();

  bgCtx.beginPath();
  bgCtx.moveTo(11*step, 9*step)
  bgCtx.lineTo(11*step, 12*step)
  bgCtx.stroke();

  bgCtx.beginPath();
  bgCtx.moveTo(11*step, 12*step)
  bgCtx.lineTo(13*step, 12*step)
  bgCtx.stroke();

  bgCtx.beginPath();
  bgCtx.moveTo(13*step, 12*step)
  bgCtx.lineTo(13*step, 4*step)
  bgCtx.stroke();

  bgCtx.beginPath();
  bgCtx.moveTo(13*step, 4*step)
  bgCtx.lineTo(11*step, 4*step)
  bgCtx.stroke();

  bgCtx.beginPath();
  bgCtx.moveTo(11*step, 4*step)
  bgCtx.lineTo(11*step, 7*step)
  bgCtx.stroke();

  bgCtx.beginPath();
  bgCtx.moveTo(11*step, 7*step)
  bgCtx.lineTo(7*step, 7*step)
  bgCtx.stroke();

  bgCtx.beginPath();
  bgCtx.moveTo(7*step, 7*step)
  bgCtx.lineTo(7*step, 4*step)
  bgCtx.stroke();

  bgCtx.beginPath();
  bgCtx.moveTo(7*step, 4*step)
  bgCtx.lineTo(5*step, 4*step)
  bgCtx.stroke();

}

const gridCenterX = Math.floor(canvas.width / step / 2) * step;
const gridCenterY = Math.floor(canvas.height / step / 2) * step;



function setInitialBackgroundColor() {
  bgCtx.fillStyle = `rgb(${currentBgColor.r}, ${currentBgColor.g}, ${currentBgColor.b})`;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
  drawGrid();
  drawH(gridCenterX - 3 * step, gridCenterY - 4 * step);
}

window.onload = setInitialBackgroundColor;



canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('touchstart', handleStart);
canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('touchmove', handleMove);
canvas.addEventListener('mouseup', handleEnd);
canvas.addEventListener('touchend', handleEnd);
drawGrid();
// 中央の交差点を基にして「H」を描画
drawH(gridCenterX - 3 * step, gridCenterY - 4 * step);