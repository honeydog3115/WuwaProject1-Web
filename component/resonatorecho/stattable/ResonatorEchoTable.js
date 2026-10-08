import { subStatInfosContext } from "../../../context/resonatorEchoContext.js"
import "./MainStatName.js"
import "./MainStatValue.js"
import "./ResonatorEchoChoice.js"
import "./SubStatName.js"
import "./SubStatValue.js"

class ResonatorEchoTable extends HTMLElement{
    #ROW_NUM = 5;
    #unsubscribe = null
    #subStatInfos = []
    #subStats = [{}, {}, {}, {}, {}]

    #substatRows = Array(this.#ROW_NUM).fill(0).map((_, index) => `
        <tr class="subStat-row-${index}">
            <td><substat-name></substat-name></td>
            <td><substat-value></substat-value></td>
        </tr>
    `).join('');    
    
    get subStats() {
        return this.#subStats
    }

    connectedCallback(){
        this.render()

        this.addEventListener('click', this.#subStatNameClickEvent)
        this.addEventListener('click', this.#subStatValueClickEvent)
        this.dispatchEvent(new CustomEvent('context-request', {
            detail: {
                context: subStatInfosContext,
                subscribe: true,
                callback: (subStatInfos, unsubscribe)=>{
                    this.#unsubscribe = unsubscribe
                    this.#subStatInfos = subStatInfos
                    console.log(subStatInfos)

                    const subStatNames = subStatInfos.map((subStatInfo)=>{
                        const {id, name: value} = subStatInfo
                        return {id, value}
                    })
                    
                    const substat_names = this.querySelectorAll('substat-name')
                    substat_names.forEach((substat_name)=>{
                        substat_name.subStatNames = subStatNames
                    })
                }
            },
            bubbles: true,
            composed: true
        })
        )
    }

    disconnectedCallback(){
        if(this.#unsubscribe){
            this.#unsubscribe();
        }
    }

    #subStatNameClickEvent = (event) => {
        event.stopPropagation();
        if(event.target.tagName === 'LI' && event.target.closest('.subStatName')){
            const target = event.target
            const subStatInfo = this.#subStatInfos.find(subStatInfo => subStatInfo.id === Number(target.dataset.id))
            const subStatRow = target.closest('[class^=subStat-row]')
            const subStatValue = subStatRow.querySelector('subStat-value')
            subStatValue.subStatValues = subStatInfo.subStatInfos
        }
    }

    #subStatValueClickEvent = (event) => {
        event.stopPropagation();
        if(event.target.tagName === 'LI' && event.target.closest('.subStatValue')){
            const target = event.target
            const subStatValueId = target.dataset.id
            const index = Number(target.dataset.index)
            const subStatInfos = this.#subStatInfos.find(subStatInfo => subStatInfo.subStatInfos.some(subStatInfo => subStatInfo.id === Number(subStatValueId))).subStatInfos
            const data = {...subStatInfos[index], index: index, length: subStatInfos.length}
            console.log(data)
            
            const tr = event.target.closest('[class^=subStat-row-]')
            const subStatsIndex = Number(tr.classList[0].replace(/\D/g, ''))
            const { id, SubStatId, ...restProps } = subStatInfos[index];
            this.#subStats[subStatsIndex] = { 
                ...restProps,
                subStatId : SubStatId,
                subStatInfoId : id,
            }

            const parentComponent = this.closest("resonatorecho-create")
            const chanceTable = parentComponent.nextElementSibling;
            
            const chanceValue = chanceTable.querySelectorAll("chance-value")[subStatsIndex]
            console.log(chanceValue)
            const chanceGauge = chanceTable.querySelectorAll("chance-gauge")[subStatsIndex]
            console.log(chanceGauge)
            chanceValue.value = {...subStatInfos[index]}
            chanceGauge.column = subStatInfos.length
            chanceGauge.index = index
        }
    }

    render() {
        this.innerHTML = `
            <div>
                <table>
                    <tr>
                        <th>
                            <resonatorecho-choice></resonatorecho-choice>
                        </th>
                    </tr>
                    <tr>
                        <td>
                            <mainstat-name></mainstat-name>
                        </td>
                        <td>
                            <mainstat-value></mainstat-value>
                        </td>
                    </tr>
                    <tr>
                        ${this.#substatRows}
                    </tr>
                </table>
            </div>
        `
    }
}

customElements.define("resonatorecho-table", ResonatorEchoTable)