// ===================== 変数定義 =====================

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
let offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
let offscreenCtx = offscreenCanvas.getContext('2d');
const gridSize = 30;
let isDrawing = false;
let draggable = true;
let staticTriangles = [];
const blueLineStartX = Math.floor(canvas.width / 2 / gridSize - 3) * gridSize;
const blueLineEndX = blueLineStartX + 6 * gridSize;
const blueLineY = canvas.height / 2 + 2 * gridSize;
let staticTriangle = null;
const point = {
    x: blueLineStartX + 3 * gridSize,
    y: blueLineY - 2 * gridSize,
    radius: 5,
    isDragging: false
};

// ===================== 関数定義 =====================

function drawDynamicTriangle() {
    ctx.fillStyle = 'rgba(0, 173, 239, 0.5)';
    ctx.beginPath();
    ctx.moveTo(blueLineStartX, blueLineY);
    ctx.lineTo(blueLineEndX, blueLineY);
    ctx.lineTo(point.x, point.y);
    ctx.closePath();
    ctx.fill();
}

function drawStaticTriangles() {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    for (let triangle of staticTriangles) {
        ctx.beginPath();
        ctx.moveTo(blueLineStartX, blueLineY);
        ctx.lineTo(blueLineEndX, blueLineY);
        ctx.lineTo(triangle.x, triangle.y);
        ctx.closePath();
        ctx.fill();
    }
}

function drawDraggablePoint() {
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, 2 * Math.PI);
    ctx.fill();
}

function resetTriangleAndPoint() {
    staticTriangles = [];
    point.x = blueLineStartX + 3 * gridSize;
    point.y = blueLineY - 2 * gridSize;
    draw();
}

function drawGrid() {
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let j = 0; j <= canvas.height; j += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
    }
}

function drawBlueLine() {
    ctx.strokeStyle = "#0000FF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(blueLineStartX, blueLineY);
    ctx.lineTo(blueLineEndX, blueLineY);
    ctx.stroke();
}

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawBlueLine();
    drawStaticTriangles();
    drawDynamicTriangle();
    drawDraggablePoint();
}

function drawUserArt() {
    ctx.drawImage(offscreenCanvas, 0, 0);
}

function draw() {
    drawBackground();
    drawUserArt();
}

function resetDrawnArt() {
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    draw();
}

// ===================== ボタンの生成 =====================

function createButton(text, eventHandler) {
    const btn = document.createElement('button');
    btn.textContent = text;
    document.body.appendChild(btn);
    btn.addEventListener('click', eventHandler);
    return btn;
}

const disableDragBtn = createButton("ドラッグを無効にする", function() {
    draggable = !draggable;
    if (draggable) {
        this.textContent = "ドラッグを無効にする";
    } else {
        this.textContent = "ドラッグを有効にする";
    }
});

const resetTriangleAndPointBtn = createButton("三角形と点をリセット", resetTriangleAndPoint);
const resetDrawnArtBtn = createButton("書いた絵をリセット", resetDrawnArt);

// ===================== イベントリスナー =====================

canvas.addEventListener('mousedown', function(e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (draggable) {
        let dx = point.x - x;
        let dy = point.y - y;
        if (dx * dx + dy * dy <= point.radius * point.radius) {
            point.isDragging = true;
        }
    } else {
        offscreenCtx.beginPath();
        offscreenCtx.moveTo(x, y);
        isDrawing = true;
    }
});

canvas.addEventListener('mousemove', function(e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (point.isDragging && draggable) {
        point.x = x;
        point.y = y;
        draw();
    } else if (!draggable && isDrawing) {
        offscreenCtx.lineTo(x, y);
        offscreenCtx.stroke();
        drawUserArt();
    }
});

canvas.addEventListener('mouseup', function(e) {
    if (point.isDragging && draggable) {
        point.x = Math.round(point.x / gridSize) * gridSize;
        point.y = Math.round(point.y / gridSize) * gridSize;

        if (Math.abs(point.y - blueLineY) === 4 * gridSize) {
            staticTriangles.push({ x: point.x, y: point.y });
        }

        point.isDragging = false;
        draw();
    } else if (!draggable && isDrawing) {
        isDrawing = false;
    }
});

// ===================== 初期描画 =====================

draw();
