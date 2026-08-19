class ResonatorechoScore extends HTMLElement{
    #score = -1

    get score(){
        return this.#score
    }

    set score(data){
        this.#score = data
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
            </div>
        `
    }
}

customElements.define("resonatorecho-score", ResonatorechoScore)