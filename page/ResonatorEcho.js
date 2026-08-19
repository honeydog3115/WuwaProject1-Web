import '../component/resonator/ResonatorChoiceBtn.js';
import '../component/resonator/ResonatorImg.js';
import '../component/resonator/ResonatorValidStat.js';
import '../component/resonatorecho/ResonatorEchoCreate.js';
import '../component/resonatorecho/ResonatorEchoScore.js';
import "../component/resonatorecho/chancetable/ChanceTable.js";

class ResonatorEcho extends HTMLElement{
    connectedCallback(){
        this.render()
    }

    render(){
        const resonatorEcho = Array(5).fill(0).map(()=>`
            <resonatorecho-create></resonatorecho-create>
            <chance-table></chance-table>
        `)

        this.innerHTML = `
            <div>
                <resonator-choice-btn></resonator-choice-btn>
                <resonator-img></resonator-img>
                <resonator-validstat></resonator-validstat>
            </div>
            <div>
                ${resonatorEcho}
                <resonatorecho-score></resonatorecho-score>
            </div>
        `
    }
}

customElements.define("resonatorecho", ResonatorEcho)