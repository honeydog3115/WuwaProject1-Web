class SubStatName extends HTMLElement{
    optionNumber = 5;
    options = Array(optionNumber).fill(0).map(() => `
    <li></li>
    `).join('');

    #subStatNames = []

    get subStatNames(){
        return this.#subStatNames;
    }

    set subStatNames(data){
        this.#subStatNames = data
        this.options = this.#subStatNames.map((subStatName)=>`
            <li>${subStatName}</li>
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

customElements.define("substat-name", SubStatName)