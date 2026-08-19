class ChanceGauge extends HTMLElement{
    #column = 0;

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
    }
}

customElements.define("chance-gauge", ChanceGauge)