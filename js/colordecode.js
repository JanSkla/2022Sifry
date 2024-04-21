let decodedInput;
let encodedInput;
let encodedCanvases;
let statusField;

let alphabet;

export async function Load(){
    document.querySelector('#content').innerHTML =  /*html*/`
    <div>
        <button id="runbtn">Run</button><br/>
        Decoded text <br/>
        <textarea readOnly id="decoded"></textarea><br/>
        <div id="encodedCanvases">
            <canvas id="canvas" width="130" height="500"></canvas><br/>
        </div>
        Encoded text <br/>
        <textarea readOnly id="encoded"></textarea><br/>
        Server validation
        <div class="border" id="status">
          Status
        </div>
    </div>
    `
    document.getElementById("runbtn").addEventListener("click", Run);
    
  decodedInput = document.getElementById("decoded");
  encodedInput = document.getElementById("encoded");
  encodedCanvases = document.getElementById("encodedCanvases");
  statusField = document.getElementById("status");

    var canvas = document.getElementById("canvas");
    var my_context = canvas.getContext('2d');
    my_context.strokeStyle = "white"; // Draws the canvas border
    my_context.rect(0, 0, 130, 50);
    my_context.stroke();
    my_context.fillStyle = "white";

    const xsize = 13;
    const ysize = 5;

    const xwidth = 130/xsize;
    const ywidth = 50/ysize;

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

    
    let data2 = await fetch("https://sifrovani.maturita.delta-www.cz/color/alphabet", {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
    })
    data2 = await data2.json();
    console.log(data2);
    alphabet = data2;
}


let decoded;

let encoded;
let token;

const Run = async () => {
    let data = await fetch("https://sifrovani.maturita.delta-www.cz/color/encode", {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
      },
    })
    data = await data.json();
    console.log(data);
  
    decoded = data.text;
    token = data.token;

    decodedInput.value = decoded;

    encoded = Process(decoded);

    const splitRows = encoded.split("\n");

    RenderGrid("canvas1", splitRows);

    encodedInput.value = encoded;
    let formData = new FormData();
    formData.append('token', token);
    formData.append('encoded', encoded);
  
    let verifyData = await fetch("https://sifrovani.maturita.delta-www.cz/verify", {
      method: 'POST',
      body: formData
    })

    //Verifikace nefunguje, na serveru to hodí error XD teoreticky by to ale správně být mělo

    statusField.innerHTML = verifyData.ok;
    statusField.style.backgroundColor = verifyData.ok ? "green" : "red";

    console.log(await verifyData.text())
}

function ProcessPart(code){

    let codeInArrs = new Array();

    for (let i = 0; i < code.length; i++){
        Object.entries(alphabet).forEach((value) => {
            if(value[0] == code[i]){
                codeInArrs.push(value[1]);
            }
        });
    }
    return codeInArrs;
}

function Process(code){

    const codeLength = code.length/3+1;

    let codeR = code.substring(0, codeLength);
    let codeG = code.substring(codeLength, codeLength*2);
    let codeB = code.substring(codeLength*2, code.length);

    console.log(codeR);
    console.log(codeG);
    console.log(codeB);

    codeR = ProcessPart(codeR);
    codeG = ProcessPart(codeG);
    codeB = ProcessPart(codeB);
    
    console.log(codeR);
    console.log(codeG);
    console.log(codeB);


    let encoded = ["K","K","K","K","K"]

    for (let l = 0; l < codeLength; l++){
        for (let i = 0; i < 5; i++){
            for (let j = 0; j < 3; j++){

                const r = codeR[l] ? codeR[l][i][j] : 0;
                const g = codeG[l] ? codeG[l][i][j] : 0;
                const b = codeB[l] ? codeB[l][i][j] : 0;

                encoded[i] += r == 1 && g == 1 && b == 1 ? "W" :
                r == 1 && g == 1 && b == 0 ? "Y" :
                r == 1 && g == 0 && b == 1 ? "M" :
                r == 0 && g == 1 && b == 1 ? "C" :
                r == 1 && g == 0 && b == 0 ? "R" :
                r == 0 && g == 1 && b == 0 ? "G" :
                r == 0 && g == 0 && b == 1 ? "B" :
                "K";
            }
        }
    
        for (let j = 0; j < 5; j++){
            encoded[j] += "K";
        }
    }
    
    let text = "";

    for (let j = 0; j < 5; j++){
        text += encoded[j];
        text += "\n"
    }

    console.log({text})

    return text;
}

function RenderGrid(canvasName, grid){

    encodedCanvases.innerHTML = `<canvas id="${canvasName}" width="${grid[0].length * 10}" height="50"></canvas><br/>`;

    const canvas = document.getElementById(canvasName);
    const my_context = canvas.getContext('2d');
    my_context.strokeStyle = "white"; // Draws the canvas border
    my_context.clearRect(0, 0, grid[0].length *10, 50);
    my_context.rect(0, 0, grid[0].length *10, 50);
    my_context.stroke();
    my_context.fillStyle = "white";
  
    const xsize = grid[0].length;
    const ysize = grid.length;
  
    const xwidth = 10;
    const ywidth = 10;
  
    var xvalue = 0;
    var yvalue = 0;
  
    for (var y = 0; y < ysize; y++) {

        if(grid[y] == false) break;

        for (var x = 0; x < xsize; x++) {
  
          const value = grid[y][x];

          my_context.fillStyle = value ==
            "W" ? "white" :
            value == "C" ? "cyan" :
            value == "M" ? "magenta" :
            value == "Y" ? "yellow" :
            value == "R" ? "red" :
            value == "G" ? "green" :
            value == "B" ? "blue" :
            "black";
  
          my_context.fillRect(xvalue, yvalue, xwidth-1, ywidth-1);
          xvalue += xwidth;
        }
        xvalue = 0;
        yvalue += ywidth;
      }
  }