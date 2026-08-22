import "../component/preset/PresetBtn.js"
import "../component/SearchComponent.js"

class PresetChoice extends HTMLElement{
    #presets = []

    set presets(data){
        this.#presets = data
        this.render()
    }

    connectedCallback(){
        this.render()
    }

    render() {
        const presetList = this.#presets.length !== 0
        ? this.#presets.map((preset)=>`
            <preset-btn></preset-btn>
        `).join("") : ""

        this.innerHTML = `
            <div>
                <div>
                    <search-component></search-component>
                </div>
                <div>
                    ${presetList}
                </div>
            </div>
        `
    }
}
customElements.define("preset-choice", PresetChoice)
