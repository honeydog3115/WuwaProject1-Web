class ChanceGauge extends HTMLElement{
    #column = 0;
    #index = -1;

    get column(){
        return this.#column
    }

    set column(data){
        this.#column = data
        this.render()
    }

    get index(){
        return this.#index
    }

    set index(data){
        this.#index = data
        this.render()
    }

    connectedCallback() {
        this.render()
    }

    render(){
        const gauge = this.#column > 0 
            ? Array.from({length: this.#column}, (_, index)=>`
                <div data-id=${index}></div>
            `).join('')
            : `<div></div>`

        this.innerHTML = `
            <div>
                ${gauge}
            </div>
        `
        const targetDiv = this.querySelector(`[data-id="${this.#index}"]`)
        if (targetDiv){
            console.log(targetDiv)
        }
    }
}

customElements.define("chance-gauge", ChanceGauge)