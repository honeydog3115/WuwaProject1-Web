import '../component/resonator/ResonatorChoiceBtn.js';
import '../component/resonator/ResonatorImg.js';
import '../component/resonator/ResonatorValidStat.js';
import '../component/resonatorecho/ResonatorEchoCreate.js';
import '../component/resonatorecho/ResonatorEchoScore.js';
import "../component/resonatorecho/chancetable/ChanceTable.js";

import { getResonatorDetail } from '../api/resonatorApi.js';

class ResonatorEcho extends HTMLElement{
    #resonatorId = 0
    #resonatorDetail = {}

    set resonatorId(data){
        this.#resonatorId = data ?? 0
        this.requestResonatorDetail(this.#resonatorId)
    }

    set resonatorDetail(data){
        this.#resonatorDetail = data
        this.render()
    }

    async requestResonatorDetail(id){
        this.resonatorDetail = await getResonatorDetail(1)
    }
    
    connectedCallback(){
        const resonatorEcho = Array(5).fill(0).map(()=>`
            <resonatorecho-create></resonatorecho-create>
            <chance-table></chance-table>
        `).join("")
    
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
        this.resonatorId = 1
    }

    render(){
        if(Object.keys(this.#resonatorDetail).length > 0){
            console.log(this.#resonatorDetail?.validStats)
            const validStatTable = this.querySelector("resonator-validstat")
            console.log(validStatTable)
            validStatTable.validStats = this.#resonatorDetail?.validStats
        }
    }
}

customElements.define("resonator-echo", ResonatorEcho)