class MainStatValue extends HTMLElement{
    optionNumber = 5;
    options = Array(optionNumber).fill(0).map(() => `
        <li></li>
    `).join('');

    #mainStatValues = []

    get mainStatValues(){
        return this.#mainStatValues
    }

    set mainStatValues(data){
        this.#mainStatValues = data
        this.options = this.#mainStatValues.map((mainStatValue)=>`
            <li data-id=${mainStatValue.id}>${mainStatValue.value}</li>
        `).join('')
    }

    connectedCallback(){
        this.render()
    }
    
    render(){
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