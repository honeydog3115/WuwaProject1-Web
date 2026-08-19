class ChanceGauge extends HTMLElement{
    #column = 5;

    get column(){
        return this.#column
    }

    set column(data){
        this.#column = data

        this.render()
    }

    connectedCallback() {
        this.render();
    }

    render(){
        const gauge = Array.from({length: this.#column}).map((_, index)=>`
            <div data-id=${index}></div>
        `).join('')

        this.innerHTML = `
            <div>
                ${this.gauge}
            </div>
        `
    }
}

customElements.define("chance-gauge", ChanceGauge)