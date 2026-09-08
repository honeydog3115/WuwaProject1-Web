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

    #substatRows = Array(this.#ROW_NUM).fill(0).map(() => `
        <tr class="subStat-row">
            <td><substat-name></substat-name></td>
            <td><substat-value></substat-value></td>
        </tr>
    `).join('');    
    
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
            const subStatRow = target.closest('.subStat-row')
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
            const parentComponent = this.closest("resonatorecho-create")
            const chanceTable = parentComponent.nextElementSibling;
            
            const chanceValue = chanceTable.querySelector("chance-value")
            console.log(chanceValue)
            const chanceGauge = chanceTable.querySelector("chance-gauge")
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
                            <choice-resonatorecho></choice-resonatorecho>
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