import "./ChanceGauge.js"
import "./ChanceValue.js"

class ChanceTable extends HTMLElement{
    #rowNumber = 5

    connectedCallback(){
        this.render()
    }

    render(){
        const content = Array.from({length: this.#rowNumber}, ()=>`
            <chance-gauge></chance-gauge>
            <chance-value></chance-value>
        `).join('')
        
        this.innerHTML = `
            <div>
                <p>상옵</p><p>등장확률</p>
            </div>
            <div>
                ${content}
            </div>
        `
    }
}

customElements.define("chance-table", ChanceTable)