class MainStatValue extends HTMLElement{
    #mainStatValues = []

    get mainStatValues(){
        return this.#mainStatValues
    }

    set mainStatValues(data){
        this.#mainStatValues = data
    }

    connectedCallback(){
        this.render()
    }
    
    render(){
        const options = this.#mainStatValues.length > 0
            ? this.#mainStatValues.map((mainStatValue)=>`
                <li data-id=${mainStatValue.id}>${mainStatValue.value}</li>
            `).join('')
            : `<li></li>`

        this.innerHTML = `
            <div class="mainStatValue">
                <ul>
                    ${options}
                </ul>
            </div>
        `
    }
}

customElements.define("mainstat-value", MainStatValue)