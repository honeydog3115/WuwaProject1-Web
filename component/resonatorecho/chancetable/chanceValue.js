class ChanceValue extends HTMLElement{
    #value = ""

    get value(){
        return this.#value
    }

    set value(data){
        this.#value = data
        this.render()
    }

    connectedCallback(){
        this.render()
    }

    render() {
        this.innerHTML = `
            <div>
                <p>${this.#value}</p>
            </div>
        `
    }
}

customElements.define("chance-value", ChanceValue)