import '../component/resonator/ResonatorChoiceBtn.js';
import '../component/resonator/ResonatorImg.js';
import '../component/resonator/ResonatorValidStat.js';
import '../component/resonatorecho/ResonatorEchoCreate.js';
import '../component/resonatorecho/ResonatorEchoScore.js';
import "../component/resonatorecho/chancetable/ChanceTable.js";
import "../page/EchoChoice.js";
import "../page/ResonatorChoice.js";

import { getAttributes } from '../api/attributeApi.js';
import { getResonatorDetail } from '../api/resonatorApi.js';
import { calcScore } from '../api/resonatorEchoApi.js';
import { getSubStatInfos } from '../api/subStatApi.js';
import { subStatInfosContext } from '../context/resonatorEchoContext.js';

class ResonatorEcho extends HTMLElement{
    #resonatorId = 0
    #resonatorDetail = {}
    #subStatInfos = []
    #attributes = []
    #subscribers = new Set();
    #targetEchoCard = {}

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
        this.addEventListener('choiceClick', this.#handleChoiceClick)
        this.addEventListener('choice-resonator', this.#choiceResonator)
        this.addEventListener('choice-echo', this.#choiceEcho)
        this.addEventListener('echoscore-calcBtn-click', this.#calcEchoScore)
        this.resonatorId = 1

        const resonatorEcho = Array(5).fill(0).map((_, index)=>`
            <div class="resonatorecho-${index}">
                <echo-card></echo-card>
                <resonatorecho-create></resonatorecho-create>
                <chance-table></chance-table>
            </div>
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
            <div>
                <echo-choice></echo-choice>
            <div>
        `
        const resonatorChoiceBtn = this.querySelector("resonator-choice-btn")
        resonatorChoiceBtn.event = new CustomEvent('choiceClick', {
            detail:{ expected: this.querySelector('resonator-choice-btn') },
            bubbles:true,
            composed: true
        })
        const resonatorechoChoices = Array.from(this.querySelectorAll('resonatorecho-choice'))
        resonatorechoChoices.map((resonatorechoChoice)=>{
            resonatorechoChoice.event = new CustomEvent('choiceClick', {
                detail: { expected: resonatorechoChoice},
                bubbles: true,
            })
        })
    }

    disconnectedCallback(){
        this.removeEventListener('context-request', this.#handleContextRequest)
        this.#subscribers.clear()
    }

    #handleChoiceClick = (event) => {
        if(event.detail.expected != event.target){
            return
        }
        event.stopPropagation()
        
        if (event.detail.expected == this.querySelector('resonator-choice-btn')){
            const resonatorChoice = this.querySelector('resonator-choice')
            resonatorChoice.showDialog();
        }

        if (Array.from(this.querySelectorAll('resonatorecho-choice')).includes(event.detail.expected)){
            const resonatorechoChoice = event.detail.expected
            const parent = resonatorechoChoice.closest('[class^=resonatorecho-]')
            const echoCard = parent.querySelector('echo-card')
            this.#targetEchoCard = echoCard
            const echoChoice = this.querySelector('echo-choice')
            echoChoice.showDialog()
        }

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
    #requestAttributes = async () => {
        this.#attributes = await getAttributes()
    }

    #choiceResonator = async (event) => {
        event.preventDefault();
        console.log(event.detail)
        this.#resonatorDetail = await getResonatorDetail(event.detail.resonator.id)
        console.log("디테일", this.#resonatorDetail)
        this.render()
        const resonatorChoice = this.querySelector('resonator-choice')
        resonatorChoice.closeDialog();
    }

    #choiceEcho = (event) => {
        event.preventDefault()
        const echo = event.detail.echo
        this.#targetEchoCard.echo = echo
        const echoChoice = this.querySelector('echo-choice')
        echoChoice.closeDialog()
    }

    #calcEchoScore = async (event) => {
        event.preventDefault()
        const resonatorEchos = this.querySelectorAll('[class^=resonatorecho-]')
        const resonatorEchoInfoDtos = Array.from(resonatorEchos).map((resonatorEcho, index) => {
            const echoCard = resonatorEcho.querySelector('echo-card')
            const resoantorEchoTables = resonatorEcho.querySelectorAll('resonatorecho-table')
            const echoSubStats = Array.from(resoantorEchoTables).flatMap((resoantorEchoTable, index) => {
                return resoantorEchoTable.subStats
            })
            return {
                "echoId" : echoCard.echo.id ?? 1,
                "mainStatId" : 1,
                "echoSubStats" : echoSubStats,
            }
        })

        const body = {
            "resonatorId" : this.#resonatorDetail.id,
            "resonatorEchoInfoDtos" : resonatorEchoInfoDtos,
            "insertDB" : false,
            "presetId" : 1
        }
        const headers = { 'Content-Type' : 'application/json' }
        const score = await calcScore(body, headers)
        const resonatorechoScore = this.querySelector('resonatorecho-score')
        resonatorechoScore.score = score
    }

    render(){
        const validStatTable = this.querySelector("resonator-validstat")
        const resonatorImg = this.querySelector("resonator-img")

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