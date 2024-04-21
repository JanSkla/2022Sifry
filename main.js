import { Load as LoadSkip } from './js/skip.js'
import { Load as LoadSkipdecode } from './js/skipdecode.js'
import { Load as LoadSimpleGrid } from './js/simplegrid.js'
import { Load as LoadSimpleGridDecode } from './js/simplegriddecode.js'
import { Load as LoadGrid } from './js/grid.js'
import { Load as LoadGridDecode } from './js/griddecode.js'
import { Load as LoadColor } from './js/color.js'
import { Load as LoadSimpleColor } from './js/simplecolor.js'
import { Load as LoadColorDecode } from './js/colordecode.js'
import { Load as LoadSimpleColorDecode } from './js/simplecolordecode.js'

document.querySelector('#app').innerHTML += /*html*/`
  <div>

    <select id="modeSelect">
      <option value="">--select--</option>
      <option value="simpleGrid">Simple grid encode</option>
      <option value="simpleGridDecode">Simple grid decode</option>
      <option value="grid">Grid encode</option>
      <option value="gridDecode">Grid decode</option>
      <option value="skip">Skip encode</option>
      <option value="skipDecode">Skip decode</option>
      <option value="color">Color encode</option>
      <option value="simpleColor">Simple color encode</option>
      <option value="simpleColorDecode">Simple color decode</option>
      <option value="color">Color encode</option>
      <option value="colorDecode">Color decode</option>
    </select>

    <div id="content">
    helo helo
    </div>

  </div>
`

document.getElementById("modeSelect").addEventListener("change", ModeSelected)

function ModeSelected(mode){
  switch (mode.target.value) {
    case 'simpleGrid':
      LoadSimpleGrid();
      break;
    case 'skip':
      LoadSkip();
      break;
    case 'skipDecode':
      LoadSkipdecode();
      break;
    case 'simpleGridDecode':
      LoadSimpleGridDecode();
      break;
    case 'grid':
      LoadGrid();
      break;
    case 'gridDecode':
      LoadGridDecode();
      break;
    case 'color':
      LoadColor();
      break;
    case 'colorDecode':
      LoadColorDecode();
      break;
    case 'simpleColor':
      LoadSimpleColor();
      break;
    case 'simpleColorDecode':
      LoadSimpleColorDecode();
      break;
  }
  console.log(mode.target.value);
}
