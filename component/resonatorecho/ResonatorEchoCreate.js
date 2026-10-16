import './stattable/ResonatorEchoTable.js';

class ResonatorEchoCreate extends HTMLElement{
    connectedCallback(){
        this.render()

        const echoDetect_Btn = this.querySelector('.echo-detect')
        echoDetect_Btn.addEventListener('click', this.dispatchEvent(
            new CustomEvent('click-echoDetect', {
                bubbles: true
            })
        ))
    }

    render(){
        this.innerHTML = `
            <div>
                <button></button>
                <button class="echo-detect">캡쳐</button>
            </div>
            <div>
                <resonatorecho-table></resonatorecho-table>
            </div>
        `
    }
}

customElements.define("resonatorecho-create", ResonatorEchoCreate)