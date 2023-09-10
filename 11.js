//グリッドを描画
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
drawGrid();


//三角形を描画
const triangleCanvas = document.getElementById('triangleCanvas');
const triangleContext = triangleCanvas.getContext('2d');
//絵を描画
const drawingCanvas = document.getElementById('drawingCanvas');
const drawingContext = drawingCanvas.getContext('2d');
