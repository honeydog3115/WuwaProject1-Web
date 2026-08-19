class SubStatValue extends HTMLElement{
    #subStatValues = []

    get subStatValues(){
        return this.#subStatValues;
    }

    set subStatValues(data){
        this.#subStatValues = data
        this.render()
    }

    connectedCallback(){
        this.render()        
    }

    render(){
        const options = this.#subStatValues.length > 0
            ? this.#subStatValues.map((subStatValue)=>`
                <li data-id=${subStatValue.id}>${subStatValue.value}</li>
            `).join('')
            : `<li></li>`
        
        this.innerHTML = `
            <div class="subStatValue">
                <ul>
                    ${options}
                </ul>
            </div>
        `
    }
}

customElements.define("substatt-value", SubStatValue)