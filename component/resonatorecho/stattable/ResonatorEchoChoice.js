const DEFAULT_WORD = "에코 선택하기"
class ResonatorEchoChoice extends HTMLElement{
    #echoName = DEFAULT_WORD

    set echoName(data){
        this.#echoName = data
        this.render()
    }

    set event(event){
        const span = this.querySelector('span')
        span.addEventListener('click', ()=>{
            this.dispatchEvent(event)
        })
    }
    
    connectedCallback(){
        this.innerHTML = `
            <div class="choiceResonatorEcho">
                <span>${this.#echoName}</span>
            </div>
        `
    }

    render(){
        const echoNameElement = this.querySelector('span')
        if(echoNameElement){
            echoNameElement.innerHTML = this.#echoName
        }
    }
}

customElements.define("resonatorecho-choice", ResonatorEchoChoice)