import { getSimplePresetsInfo } from "../api/presetApi.js"
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
        this.#initData()
    }

    #initData = async () => {
        const simplePresetInfos = await getSimplePresetsInfo(1)
        console.log(simplePresetInfos)
        this.#presets = simplePresetInfos
        this.render()   
    }

    render() {
        if(this.innerHTML === ""){
            this.innerHTML = `
                <div>
                    <div>
                        <search-component></search-component>
                    </div>
                    <div class="preset-list">
                    </div>
                </div>
            `
        }

        const presetListContainer = this.querySelector('.preset-list')
        const presetList = this.#presets.length !== 0
        ? this.#presets.map((preset)=>`
            <preset-btn></preset-btn>
        `).join("") : ""
        presetListContainer.innerHTML = presetList
        
        if (this.#presets.length > 0) {
            const presetBtns = this.querySelectorAll('preset-btn')
            Array.from(presetBtns).forEach((presetBtn, index) => {
                presetBtn.preset = this.#presets[index]
            })
        }
    }
}
customElements.define("preset-choice", PresetChoice)
