const reset = document.getElementById('reset');
const canvas = document.getElementById('myCanvas');
const cLeft = canvas.getBoundingClientRect().left;
const cTop = canvas.getBoundingClientRect().top;
const context = canvas.getContext('2d');
const curves = [
    {x1: 800, y1: 400, x2: 675, y2: 342 },
    {x1: 900, y1: 150, x2: 843, y2: 263},
];
let dragStart, dragEnd, dragIndex;
let dropZones = document.querySelectorAll('.drop');

draw();

canvas.addEventListener('mousedown',mouseDown)
canvas.addEventListener('mousemove',mousemove)
canvas.addEventListener('mouseup',mouseup)

// Draw curves and circles on canvas
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  curves.forEach(function(curve, index) {
  const { x1, y1, x2, y2 } = curve;
  context.beginPath();
  context.moveTo(x1, y1);
  context.bezierCurveTo(x1, y1 + 200, x2, y2 - 200, x2, y2);
  context.lineWidth = 6;
  context.strokeStyle = '#00872D';
  context.stroke();

  context.fillstyle = '#E57C00';
  context.beginPath();
  context.arc(x1, y1, 10, 0, 2 * Math.PI);
  context.fill();
  //context.beginPath();
  //context.arc (x2, y2, 10, 0, 2 * Math.PI);
  //context.fill();
  curves [index] = {x1, y1, x2, y2 };
  });
}

// Mouse down event handler
function mouseDown (e) {
  const x = = e.clientX - cLeft;
  const y = e.clientYcTop;

  for (let i = 0; i < curves.length; i++) {
    const curve = curves[i];
    const { x1, y1 } = curve;
    if (Math.pow(x - x1, 2) + Math.pow(y - y1, 2) < 100){
      dragStart = true;
      dragIndex = i;
      break;
    }
  }
}

//Mouse move event handler
function mouseMove(e){
  if(dragStart){
    curves[dragIndex].x1 = e.clientX - cLeft;
    curves[dragIndex].y1 = e.clientY - cTop;
  }
}

//Mouse up event handler 
function mouseUp(e){
  dropZones.forEach(function(dropZone){
    const rect = dropZone.getBoundingClientRect();
    const overlaps = curves.filter(function(curve){
      const{x1,y1} = curve;
      return x1 + cLeft >= rect.left && x1 + cLeft <= rect.right && y1 + cTop >= rect.top && y1 + cTop <= rect.bottom;
    });
    if(overlaps.length > 0){
      dropZone.classList.add('dropped');
    } else {
      dropZone.classList.remove('dropped');
    }
  });

  //reset drag values
  dragStart = false;
  dragEnd = false;
  reset.classList.remove('d_none');
}

