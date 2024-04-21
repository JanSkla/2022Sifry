import { GetRandomChar } from "./utils";

let decodedInput;
let encodedInput;
let statusField;

export function Load(){
  document.querySelector('#content').innerHTML =  /*html*/`
  <div>
      <button id="runbtn">Run</button><br/>
      Decoded text <br/>
      <textarea readOnly id="decoded"></textarea><br/>
      Encoded text <br/>
      <textarea readOnly id="encoded"></textarea><br/>
      Grid <br/>
      <canvas id="gridCanvas" width="100" height="100"></canvas><br/>
      Server validation
      <div class="border" id="status">
        Status
      </div>
  </div>
  `
  document.getElementById("runbtn").addEventListener("click", Run);
  
  decodedInput = document.getElementById("decoded");
  encodedInput = document.getElementById("encoded");
  statusField = document.getElementById("status");


  RenderEmptyGrid("gridCanvas", 5, 5);
}


let encoded;
let grid;
let token;
let decoded;

const Run = async () => {
  let data = await fetch("https://sifrovani.maturita.delta-www.cz/grid-simple/encode", {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
  })
  data = await data.json();
  console.log(data);

  decoded = data.text;
  grid = data.grid;
  token = data.token;

  decodedInput.value = decoded;
  
  RenderGrid("gridCanvas", grid);

  encoded = "";

  let textIndex = 0;

  while (textIndex < decoded.length){
    for(let y = 0; y < grid.length; y++){
      for(let x = 0; x < grid.length; x++){
        if(grid[y].includes(x)){

          encoded += decoded[textIndex] ?? GetRandomChar();
          textIndex++;
        }
        else{
          encoded += GetRandomChar();
        }
      }
      encoded += "\n";
    }
    encoded += "\n";
  }

  console.log(encoded)
  encodedInput.value = encoded;

  let formData = new FormData();
  formData.append('token', token);
  formData.append('encoded', encoded);

  let verifyData = await fetch("https://sifrovani.maturita.delta-www.cz/verify", {
    method: 'POST',
    body: formData
  })

  verifyData = await verifyData.json();

  statusField.innerHTML = verifyData.success;
  statusField.style.backgroundColor = verifyData.success ? "green" : "red";
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