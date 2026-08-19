import './stattable/ResonatorEchoTable.js';

class ResonatorEchoCreate extends HTMLElement{
    connectedCallback(){
        this.render()
    }
    render(){
        this.innerHTML = `
            <div>
                <button></button>
                <button></button>
            </div>
            <div>
                <resonatorecho-table></resonatorecho-table>
            </div>
        `
    }
}

customElements.define("resonatorecho-create", CreateResonatorEcho)