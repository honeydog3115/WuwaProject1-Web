class ChoiceResonatorEcho extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
            <div class="choiceResonatorEcho">
            </div>
        `
    }
}

customElements.define("choice-resonatorecho", ChoiceResonatorEcho)