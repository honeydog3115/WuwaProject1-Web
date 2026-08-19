class SubStatName extends HTMLElement{
    #subStatNames = []

    get subStatNames(){
        return this.#subStatNames;
    }

    set subStatNames(data){
        this.#subStatNames = data
        this.render()
    }

    connectedCallback(){
        this.render()        
    }

    render(){
        const options = this.#subStatNames.length > 0
            ? this.#subStatNames.map((subStatName)=>`
                <li data-id=${subStatName.id}>${subStatName.value}</li>
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

customElements.define("substat-name", SubStatName)