import '../component/resonator/ResonatorChoiceBtn.js';
import '../component/resonator/ResonatorImg.js';
import '../component/resonator/ResonatorValidStat.js';
import '../component/resonatorecho/ResonatorEchoCreate.js';
import '../component/resonatorecho/ResonatorEchoScore.js';
import "../component/resonatorecho/chancetable/ChanceTable.js";

import { getResonatorDetail } from '../api/resonatorApi.js';
import { getSubStatInfos } from '../api/subStatApi.js';
import { subStatInfosContext } from '../context/resonatorEchoContext.js';

class ResonatorEcho extends HTMLElement{
    #resonatorId = 0
    #resonatorDetail = {}
    #subStatInfos = []
    #subscribers = new Set();
    #btnEvent = null

    set resonatorId(data){
        if(this.#resonatorId !== data){
            this.#resonatorId = data ?? 0
            this.dispatchEvent(new CustomEvent('resonatorDetail-request', {}))
        }
        else
            return
    }

    set resonatorDetail(data){
        this.#resonatorDetail = data
        this.render()
    }

    connectedCallback(){
        this.addEventListener('context-request', this.#handleContextRequest)
        this.addEventListener('resonatorDetail-request',this.#requestResonatorDetail)
        this.#btnEvent = new CustomEvent('click', {
            detail:{
                callback:()=>{
                    const resonator_choice = this.querySelector('resonator-choice')
                    resonatorChoice.showDialog()
                }
            },
            bubbles:true,
            composed: true
        })
        this.resonatorId = 1

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
            <div>
                <resonator-choice></resonator-choice>
            <div>
        `
    }

    disconnectedCallback(){
        this.removeEventListener('context-request', this.#handleContextRequest)
        this.#subscribers.clear()
    }

    #handleContextRequest = async (event) => {
        if(event.detail.context === subStatInfosContext){
            event.stopPropagation()

            const { callback, subscribe } = event.detail
            const unsubscribe = () => { this.#subscribers.delete(callback) } 

            if(subscribe || this.#subStatInfos.length == 0){
                this.#subscribers.add(callback)
            }

            const data = await getSubStatInfos()
            this.#subStatInfos = data

            callback(this.#subStatInfos, unsubscribe)
        }
    }

    #requestResonatorDetail = async (event) => {
        this.resonatorDetail = await getResonatorDetail(this.#resonatorId)
    }

    render(){
        const validStatTable = this.querySelector("resonator-validstat")
        const resonatorImg = this.querySelector("resonator-img")
        const resonatorChoiceBtn = this.querySelector("resonator-choice-btn")
        resonatorChoiceBtn.event = this.#btnEvent
        if(Object.keys(this.#resonatorDetail).length > 0){
            console.log(this.#resonatorDetail)
            validStatTable.validStats = this.#resonatorDetail?.validStats
            const resonatorImgProp = {
                attributeImg : this.#resonatorDetail.attribute.imagePath,
                resonatorImg : this.#resonatorDetail.imagePath,
                resonatorName : this.#resonatorDetail.name
            }
            resonatorImg.property = resonatorImgProp
        }
    }
}

customElements.define("resonator-echo", ResonatorEcho)