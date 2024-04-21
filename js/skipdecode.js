import { GetRandomChar } from "./utils";

let statusField;
let encodedInput;
let decodedInput;
let skipInput;
let offsetInput;


  

export function Load(){

  

  document.querySelector('#content').innerHTML = /*html*/`
  <div>
    <button id="runbtn">Run</button><br/>
    Skip <input readOnly type="number" id="skip"><br/>
    Offset <input readOnly type="number" id="offset"><br/>
    Decoded text
    <textarea readOnly id="decoded"></textarea><br/>
    Encoded text
    <textarea readOnly id="encoded"></textarea><br/>
    Server validation
    <div class="border" id="status">
      Status
    </div>
  </div>
  `

  document.getElementById("runbtn").addEventListener("click", Run);

  statusField = document.getElementById("status");
  encodedInput = document.getElementById("encoded");
  decodedInput = document.getElementById("decoded");
  skipInput = document.getElementById("skip");
  offsetInput = document.getElementById("offset");
}


let encoded;
let skip;
let offset;
let token;

let decoded;

const Run = async () => {
  let data = await fetch("https://sifrovani.maturita.delta-www.cz/skip/encode", {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
  })
  data = await data.json();
  console.log(data);
  skip = data.skip;
  offset = data.offset;
  decoded = data.text;
  token = data.token;

  skipInput.value = skip;
  offsetInput.value = offset;
  decodedInput.innerHTML = decoded;

  encoded = "";
  
  for (let j = 0; j < offset; j++){
    encoded += GetRandomChar();
  }
  for (let i = 0; i < decoded.length; i++){
    encoded += decoded[i];
    for (let j = 0; j < skip; j++){
        encoded += GetRandomChar();
    }
  }
  encoded = encoded.toUpperCase();
  encodedInput.innerHTML = encoded;

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

  console.log(verifyData);
}