import '../component/resonator/ResonatorChoiceBtn.js';
import '../component/resonator/ResonatorImg.js';
import '../component/resonator/ResonatorValidStat.js';
import '../component/resonatorecho/ResonatorEchoCreate.js';
import '../component/resonatorecho/ResonatorEchoScore.js';
import "../component/resonatorecho/chancetable/ChanceTable.js";
import "../page/EchoChoice.js";
import "../page/PresetSave.js";
import "../page/ResonatorChoice.js";
import "./ResonatorEchoDetect.js";

import { getAttributes } from '../api/attributeApi.js';
import { getPreset, savePreset } from '../api/presetApi.js';
import { getResonatorDetail } from '../api/resonatorApi.js';
import { calcScore } from '../api/resonatorEchoApi.js';
import { getSubStatInfos } from '../api/subStatApi.js';
import { subStatInfosContext } from '../context/resonatorEchoContext.js';
import { testSetting } from '../test/subStatSetting.js';

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
        this.addEventListener('click-echoDetect', this.#showResonatorEchoDetect)
        document.addEventListener('preset-loading', this.#presetLoading)
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
                <button class='preset-save'>저장하기</button>
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
            <div>
                <preset-save></preset-save>
            </div>
            <div>
                <resonatorecho-detect></resonatorecho-detect>
            </div>
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
        const presetBtn = this.querySelector('.preset-save')
        presetBtn.addEventListener('click', () => {
                        presetBtn.dispatchEvent(new CustomEvent('choiceClick', 
                            {
                                detail : { expected: presetBtn },
                                bubbles : true,
                                composed : true,
                            }))
                        })
        const presetSave = this.querySelector('preset-save')
        presetSave.submitFunction = this.#savePreset
        testSetting(this)
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

        if (event.detail.expected == this.querySelector('.preset-save')){
            const presetSave = this.querySelector('preset-save')
            presetSave.showDialog()
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

            if (this.#subStatInfos.length === 0){
                const data = await getSubStatInfos()
                this.#subStatInfos = data
            }

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
        const resonatorId = event.detail.resonator.id
        this.#resonatorDetail = await getResonatorDetail(resonatorId)
        this.#resonatorId = resonatorId
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

    #savePreset = (inputElement) => {
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
        const headers = { 'Content-Type' : 'application/json' }
        const body = {
            "userId" : 1,
            "name" : inputElement.value,
            "resonatorId" : this.#resonatorId,
            "score" : this.querySelector('resonatorecho-score').score,
            "bookmark" : false,
            "echosInfo" : resonatorEchoInfoDtos
        }
        savePreset(headers, body)
    }

    #presetLoading = async (event) => {
        const presetId = event.detail.preset.id
        const preset = await getPreset(presetId)
        console.log(preset)

        this.resonatorDetail = preset.resonatorDetailDto
        
        const resonatorEchos = this.querySelectorAll('[class^=resonatorecho-]')
        Array.from(resonatorEchos).forEach((resonatorEcho, index) => {
            const echocard = resonatorEcho.querySelector('echo-card')
            const resonatorEchoInfo = preset.echoDetailDtos[index]
            const echo = resonatorEchoInfo.echo
            const subStatDetail = resonatorEchoInfo.subStatDetailDtos
            echocard.echo = echo

            const resonatorEchoTable = resonatorEcho.querySelector('resonatorecho-table')
            const subStatNames =  resonatorEchoTable.querySelectorAll('substat-name')
            const subStatValues =  resonatorEchoTable.querySelectorAll('substat-value')

            Array.from(subStatNames).forEach((subStatName, index) => {
                const list = subStatName.querySelectorAll('li')
                const target = Array.from(list).find((li) => li.textContent === subStatDetail[index].subStatName)
                target?.click()
            })
            
            Array.from(subStatValues).forEach((subStatValue, index) => {
                const list = subStatValue.querySelectorAll('li')
                const target = Array.from(list).find((li) => li.textContent === subStatDetail[index].subStatValue)
                target?.click()
            })
        })
        
        const resonatorEchoScore = this.querySelector('resonatorecho-score')
        resonatorEchoScore.score = preset.totalScore
    }

    #showResonatorEchoDetect = () => {
        const resoantorEchoDetect = this.querySelector('resonatorecho-detect')
        resoantorEchoDetect.showDialog()
    }

    render(){
        const validStatTable = this.querySelector("resonator-validstat")
        const resonatorImg = this.querySelector("resonator-img")

        if(Object.keys(this.#resonatorDetail).length > 0){
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