class PresetSave extends HTMLElement{
    #submitFunction = null
    #dialog = null

    set submitFunction(data) {
        this.#submitFunction = data
        this.render()
    }

    connectedCallback(){
        this.render()
        const form = this.querySelector('form')
        const input = this.querySelector('input')
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                form.onsubmit()
            }
        });

        this.#dialog = this.querySelector('dialog')
    }

    showDialog(){
        if(this.#dialog && !this.#dialog.open){
            this.#dialog.showModal()
        }
    }

    closeDialog(){
        if(this.#dialog && this.#dialog.open){
            this.#dialog.close()
        }
    }

    #handleDialogClose = (event) => {
        const rect = this.#dialog.getBoundingClientRect()
        const isClickOutside = (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
        );

        if (isClickOutside) {
            this.closeDialog();
        }
    }
    
    render(){
        if(this.innerHTML === ""){
            this.innerHTML = `
                <div>
                    <dialog>
                        <form action="/preset/save" method="post">
                            <div>
                                <input>
                            </div>
                        </form>
                    </dialog>
                </div>
            `
        }

        if(this.#submitFunction !== null){
            form.onsubmit = this.#submitFunction
        }

    }
}
customElements.define("preset-save", PresetSave)