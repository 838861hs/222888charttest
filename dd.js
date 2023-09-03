let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
const gridSize = 30;

let point = {
    x: (Math.round(canvas.width / 2 / gridSize) - 1) * gridSize,
    y: Math.round(canvas.height / 2 / gridSize) * gridSize,
    radius: 5,
    isDragging: false
};

let triangles = [];

function drawGrid() {
    ctx.strokeStyle = "#e0e0e0";
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

function drawBlueLineAndTriangle() {
    const startX = Math.floor(canvas.width / 2 / gridSize - 3) * gridSize;
    const endX = startX + 6 * gridSize;
    const posY = canvas.height / 2 + 2 * gridSize;

    ctx.strokeStyle = "#0000FF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, posY);
    ctx.lineTo(endX, posY);
    ctx.stroke();

    triangles.forEach(triangle => {
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";  // 保持された赤い三角形
        ctx.beginPath();
        ctx.moveTo(startX, posY);
        ctx.lineTo(endX, posY);
        ctx.lineTo(triangle.x, triangle.y);
        ctx.closePath();
        ctx.fill();
    });

    if (Math.abs(point.y - posY) === 4 * gridSize) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";  // 赤色で透過
    } else {
        ctx.fillStyle = "rgba(173, 216, 230, 0.5)";  // 水色で透過
    }
    ctx.beginPath();
    ctx.moveTo(startX, posY);
    ctx.lineTo(endX, posY);
    ctx.lineTo(point.x, point.y);
    ctx.closePath();
    ctx.fill();
}

function drawPoint() {
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, 2 * Math.PI);
    ctx.fill();
}

canvas.addEventListener('mousedown', function(event) {
    if (Math.sqrt((event.clientX - canvas.offsetLeft - point.x) ** 2 + 
                  (event.clientY - canvas.offsetTop - point.y) ** 2) < point.radius) {
        point.isDragging = true;
    }
});

canvas.addEventListener('mouseup', function() {
    if (point.isDragging) {
        point.x = Math.round(point.x / gridSize) * gridSize;
        point.y = Math.round(point.y / gridSize) * gridSize;

        const posY = canvas.height / 2 + 2 * gridSize;
        if (Math.abs(point.y - posY) === 4 * gridSize) {
            triangles.push({ x: point.x, y: point.y });
        }

        point.isDragging = false;
        draw();
    }
});

canvas.addEventListener('mousemove', function(event) {
    if (point.isDragging) {
        point.x = event.clientX - canvas.offsetLeft;
        point.y = event.clientY - canvas.offsetTop;
        draw();
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawBlueLineAndTriangle();
    drawPoint();
}

draw();
