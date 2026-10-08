class ResonatorEchoScore extends HTMLElement{
    #score = -1

    get score(){
        return this.#score
    }

    set score(data){
        this.#score = data
        this.render()
    }

    connectedCallback(){
        this.render()
        const btn = this.querySelector('button')
        btn.addEventListener('click', this.#btnClickEvent)
    }

    #btnClickEvent = (event) => {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('echoscore-calcBtn-click', {
            bubbles: true,
        }))
    }

    render(){
        this.innerHTML = `
            <div>
                <div>
                    <label>에코 점수</label>
                </div>
                <div>
                    ${this.#score}
                </div>
                <div>
                    <button>계산하기</button>
                <div>
            </div>
        `
    }
}

customElements.define("resonatorecho-score", ResonatorEchoScore)