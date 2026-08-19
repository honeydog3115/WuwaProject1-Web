class MainStatName extends HTMLElement{
    optionNumber = 5;
    options = Array(optionNumber).fill(0).map(() => `
    <li></li>
    `).join('');

    #mainStatNames = []

    get mainStatNames(){
        return this.#mainStatNames;
    }

    set mainStatNames(data){
        this.#mainStatNames = data
        this.options = this.#mainStatNames.map((mainStatName)=>`
            <li>${mainStatName}</li>
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

customElements.define("mainstat-name", MainStatName)