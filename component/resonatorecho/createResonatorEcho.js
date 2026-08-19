class CreateResonatorEcho extends HTMLElement{
    connectedCallback(){
        this.render()
    }
    render(){
        this.innerHTML = `
            <div>
                <button></button>
                <button></button>
            </div>
            <div>
                <resonatorecho-table></resonatorecho-table>
            </div>
        `
    }
}

customElements.define("create-resonatorecho", CreateResonatorEcho)