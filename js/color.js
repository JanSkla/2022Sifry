let decodedInput;
let encodedInput;
let encodedCanvases;
let statusField;

let alphabet;

export async function Load(){
    document.querySelector('#content').innerHTML =  /*html*/`
    <div>
        <button id="runbtn">Run</button><br/>
        Encoded text <br/>
        <textarea readOnly id="encoded"></textarea><br/>
        <div id="encodedCanvases">
            <canvas id="canvas" width="130" height="500"></canvas><br/>
        </div>
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
    let data = await fetch("https://sifrovani.maturita.delta-www.cz/color/decode", {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
      },
    })
    data = await data.json();
    console.log(data);
  
    encoded = data.encoded;
    token = data.token;

    encodedInput.value = encoded;

    const splitRows = encoded.split("\n");

    RenderGrid("canvas1", splitRows);
    RenderGrid("canvasR", splitRows);
    RenderGrid("canvasG", splitRows);
    RenderGrid("canvasB", splitRows);

    let textIndex = 0;
    
    decoded = "";


    let Rtext = "";
    let Gtext = "";
    let Btext = "";

    while(textIndex + 4 < splitRows[0].length){

        let gridChar = [
            [splitRows[0].substring(textIndex+1, textIndex+4)],
            [splitRows[1].substring(textIndex+1, textIndex+4)],
            [splitRows[2].substring(textIndex+1, textIndex+4)],
            [splitRows[3].substring(textIndex+1, textIndex+4)],
            [splitRows[4].substring(textIndex+1, textIndex+4)]
        ]

        const gridCharR = [];
        const gridCharG = [];
        const gridCharB = [];

        gridChar.forEach(row =>{

            const rowR = [];
            const rowG = [];
            const rowB = [];

            row[0].split("").forEach(char => {

                switch(char){
                    case "W":
                        rowR.push(1);
                        rowG.push(1);
                        rowB.push(1);
                        break;
                    case "Y":
                        rowR.push(1);
                        rowG.push(1);
                        rowB.push(0);
                        break;
                    case "M":
                        rowR.push(1);
                        rowG.push(0);
                        rowB.push(1);
                        break;
                    case "C":
                        rowR.push(0);
                        rowG.push(1);
                        rowB.push(1);
                        break;
                    case "R":
                        rowR.push(1);
                        rowG.push(0);
                        rowB.push(0);
                        break;
                    case "G":
                        rowR.push(0);
                        rowG.push(1);
                        rowB.push(0);
                        break;
                    case "B":
                        rowR.push(0);
                        rowG.push(0);
                        rowB.push(1);
                        break;
                    case "K":
                        rowR.push(0);
                        rowG.push(0);
                        rowB.push(0);
                        break;
                }
            })
            gridCharR.push(rowR);
            gridCharG.push(rowG);
            gridCharB.push(rowB);
        });

        Object.entries(alphabet).forEach((value) => {

            const letter = JSON.stringify(value[1]);


            if(letter == JSON.stringify(gridCharR)){
                Rtext += value[0];
            }
            if(letter == JSON.stringify(gridCharG)){
                Gtext += value[0];
            }
            if(letter == JSON.stringify(gridCharB)){
                Btext += value[0];
            }
        });

        textIndex += 4;
    }

    decoded += Rtext + Gtext + Btext;

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