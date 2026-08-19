class MainStatName extends HTMLElement{
    #mainStatNames = []

    get mainStatNames(){
        return this.#mainStatNames;
    }

    set mainStatNames(data){
        this.#mainStatNames = data
        this.render()
    }

    connectedCallback(){
        this.render()        
    }

    render(){
        const options = this.#mainStatNames.length > 0
            ? this.#mainStatNames.map((mainStatName)=>`
                <li>${mainStatName}</li>
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

customElements.define("mainstat-name", MainStatName)