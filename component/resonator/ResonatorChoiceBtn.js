class ResonatorChoiceBtn extends HTMLElement{
    connectedCallback(){
        this.render()
    }

    set event(event){
        const btn = this.querySelector('button')
        btn.addEventListener('click', ()=>{
            this.dispatchEvent(event)
        })
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