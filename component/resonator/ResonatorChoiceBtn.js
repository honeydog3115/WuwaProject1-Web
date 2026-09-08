class ResonatorChoiceBtn extends HTMLElement{
    connectedCallback(){
        this.render()
    }

    set event(data){
        this.addEventListener('btnEvent', data)
    }

    render() {
        this.innerHTML = `
            <div>
                <button>공명자 선택</button>
            </div>
        `
    }
}

customElements.define("resonator-choice-btn", ResonatorChoiceBtn)