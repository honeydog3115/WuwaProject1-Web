class SubStatValue extends HTMLElement{
    optionNumber = 5;
    options = Array(optionNumber).fill(0).map(() => `
    <li></li>
    `).join('');

    #subStatValues = []

    get subStatValues(){
        return this.#subStatValues;
    }

    set subStatValues(data){
        if (!Array.isArray(data)) return;

        this.#subStatValues = data
        this.options = this.#subStatValues.map((subStatValue)=>`
            <li data-id=${subStatValue.id}>${subStatValue.value}</li>
        `).join('');

        this.render()
    }

    connectedCallback(){
        this.render()        
    }

    render(){
        this.innerHTML = `
            <div class="subStatValue">
                <ul>
                    ${this.options}
                </ul>
            </div>
        `
    }
}

customElements.define("substatt-value", SubStatValue)