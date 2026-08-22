class PresetBtn extends HTMLElement{
    #bookmark = false
    #bookmarkOn = "imagePath/On"
    #bookmarkOff = "imagePath/Off"
    #preset = {id: 0, name: ""}

    get preset(){
        return this.#preset
    }

    set preset({id: id, name: name}){
        this.#preset.id = id ? id : 0 
        this.#preset.name = name ? name : ""
        this.render()
    }

    connectedCallBack(){
        this.render()
    }

    render() {
        const bookmarkImage = this.#bookmark ? this.#bookmarkOn:this.#bookmarkOff
        const presetName = this.#preset.name
        this.innerHTML = `
            <div>
                <button>
                    <span>
                        ${presetName}
                    </span>
                    <img src="${bookmarkImage}">
                </button>
            </div>
        `
    }
}
customElements.define("preset-btn", PresetBtn)