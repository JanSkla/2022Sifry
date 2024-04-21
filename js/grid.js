let decodedInput;
let encodedCanvases;
let statusField;

export function Load(){
  document.querySelector('#content').innerHTML =  /*html*/`
  <div>
      <button id="runbtn">Run</button><br/>
      Encoded text <br/>
      <div id="encoded">
        <canvas id="canvas" width="100" height="100"></canvas><br/>
      </div>
      Grid <br/>
      <canvas id="gridCanvas" width="100" height="100"></canvas><br/>
      Decoded text <br/>
      <textarea readOnly id="decoded"></textarea><br/>
      Server validation
      <div class="border" id="status">
        Status
      </div>
  </div>
  `
  document.getElementById("runbtn").addEventListener("click", Run);
  
  decodedInput = document.getElementById("decoded");
  encodedCanvases = document.getElementById("encoded");
  statusField = document.getElementById("status");


  RenderEmptyGrid("canvas", 5, 5);
  RenderEmptyGrid("gridCanvas", 5, 5);
}


let encoded;
let grid;
let token;
let decoded;

const Run = async () => {
  let data = await fetch("https://sifrovani.maturita.delta-www.cz/grid/decode", {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
  })
  data = await data.json();
  console.log(data);

  encoded = data.encoded;
  grid = data.grid;
  token = data.token;

  const codeParts = encoded.split("\n\n");

  encodedCanvases.innerHTML = "";
  decoded = "";
  for (var i = 0; i < codeParts.length; i++) {
    if(codeParts[i]){
      const name = "canvas"+i;
    
      encodedCanvases.innerHTML += /*html*/`<canvas id="${name}" width="100" height="100"></canvas><br/>`
    
    }
  }
  for (var i = 0; i < codeParts.length; i++) {
    if(codeParts[i])
      ProcessPart(codeParts[i], i);
  }
  RenderGrid("gridCanvas", grid);
  decodedInput.value = decoded;


  let formData = new FormData();
  formData.append('token', token);
  formData.append('decoded', decoded);

  let verifyData = await fetch("https://sifrovani.maturita.delta-www.cz/verify", {
    method: 'POST',
    body: formData
  })

  verifyData = await verifyData.json();

  statusField.innerHTML = verifyData.success;
  statusField.style.backgroundColor = verifyData.success ? "green" : "red";
}

function ProcessPart(codePart, index){

  const name = "canvas"+index;
  const codeSplit = codePart.split("\n")


  RenderTextGrid(name, codeSplit, grid);

  console.log(codeSplit)
  for (var r = 0; r < 4; r++){
    for (var y = 0; y < grid.length; y++) {
      for (var x = 0; x < grid[y].length; x++) {
  
        const xx = grid[y][x];
        decoded += codeSplit[y][xx];
      }
    }

    console.log(decoded)

    console.log(grid) 
    grid = RotateGrid(grid);
  }
}

export function RotateGrid(grid){

  let newgrid = new Array(grid.length);

  for (var i = 0; i < newgrid.length; i++) {
    newgrid[i] = []
  };
  
  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid.length; x++) {
      if(grid[y].includes(x)){
        newgrid[x].unshift(grid.length - 1 - y);
      }
    }
  }

  return newgrid;
}

function RenderGrid(canvasName, grid){
  const canvas = document.getElementById(canvasName);
  const my_context = canvas.getContext('2d');
  my_context.strokeStyle = "white"; // Draws the canvas border
  my_context.clearRect(0, 0, 100, 100);
  my_context.rect(0, 0, 100, 100);
  my_context.stroke();
  my_context.fillStyle = "white";

  const xsize = grid.length;
  const ysize = grid.length;

  const xwidth = 100/xsize;
  const ywidth = 100/ysize;

  var xvalue = 0;
  var yvalue = 0;

  for (var y = 0; y < ysize; y++) {
      for (var x = 0; x < xsize; x++) {

        my_context.fillStyle = grid[y].includes(x) ? "white" : "black";

        my_context.fillRect(xvalue, yvalue, xwidth-1, ywidth-1);
        xvalue += xwidth;
      }
      xvalue = 0;
      yvalue += ywidth;
    }
}

function RenderTextGrid(canvasName, textgrid, grid){
  const canvas = document.getElementById(canvasName);
  console.log(canvasName,canvas)
  const my_context = canvas.getContext('2d');
  console.log(my_context)
  my_context.strokeStyle = "white"; // Draws the canvas border
  my_context.clearRect(0, 0, 100, 100);
  my_context.rect(0, 0, 100, 100);
  my_context.stroke();
  my_context.fillStyle = "white";
  console.log(my_context)

  const xsize = textgrid.length;
  const ysize = textgrid.length;

  const xwidth = 100/xsize;
  const ywidth = 100/ysize;

  var xvalue = 0;
  var yvalue = 0;

  for (var y = 0; y < ysize; y++) {
    for (var x = 0; x < xsize; x++) {
      my_context.fillStyle = grid[y].includes(x) ? "yellow" : "white";
      my_context.fillRect(xvalue, yvalue, xwidth-1, ywidth-1);
      my_context.fillStyle = "black";
      my_context.fillText(textgrid[y][x], xvalue + 2, yvalue+ywidth/1.5)
      xvalue += xwidth;
    }
    xvalue = 0;
    yvalue += ywidth;
  }
}

function RenderEmptyGrid(canvasName, xsize, ysize){
  const canvas = document.getElementById(canvasName);
  const my_context = canvas.getContext('2d');
  my_context.strokeStyle = "white"; // Draws the canvas border
  my_context.clearRect(0, 0, 100, 100);
  my_context.rect(0, 0, 100, 100);
  my_context.stroke();
  my_context.fillStyle = "white";

  const xwidth = 100/xsize;
  const ywidth = 100/ysize;

  var xvalue = 0;
  var yvalue = 0;

  for (var y = 0; y < ysize; y++) {
    for (var x = 0; x < xsize; x++) {
      my_context.fillRect(xvalue, yvalue, xwidth-1, ywidth-1);
      xvalue += xwidth;
    }
    xvalue = 0;
    yvalue += ywidth;
  }
}