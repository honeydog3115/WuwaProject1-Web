class ResonatorEchoScore extends HTMLElement{
    #score = -1

    get score(){
        return this.#score
    }

    set score(data){
        this.#score = data
    }

    connectedCallback(){
        this.render()
    }

    #btnClickEvent = (event) => {
        event.preventDefault();
        
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
                    <button onclick="">계산하기</button>
                <div>
            </div>
        `
    }
}

customElements.define("resonatorecho-score", ResonatorEchoScore)