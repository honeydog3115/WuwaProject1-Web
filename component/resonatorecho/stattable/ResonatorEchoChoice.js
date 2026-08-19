class ResonatorEchoChoice extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
            <div class="choiceResonatorEcho">
            </div>
        `
    }
}

customElements.define("resonatorecho-choice", ChoiceResonatorEcho)