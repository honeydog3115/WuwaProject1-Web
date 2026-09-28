class ResonatorEchoChoice extends HTMLElement{
    set event(event){
        const span = this.querySelector('span')
        span.addEventListener('click', ()=>{
            this.dispatchEvent(event)
        })
    }
    
    connectedCallback(){
        this.innerHTML = `
            <div class="choiceResonatorEcho">
                <span>에코 선택하기</span>
            </div>
        `
    }
}

customElements.define("resonatorecho-choice", ResonatorEchoChoice)