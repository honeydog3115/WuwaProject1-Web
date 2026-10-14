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
        this.addEventListener('render-presetChoice', this.render)
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
        if (this.#presets.length > 0) {
            const presetListContainer = this.querySelector('.preset-list')
            const presetList = this.#presets.length !== 0
            ? this.#presets.map((preset)=>{
                return `
                    <preset-btn data-bookmark="${preset.bookmark}"></preset-btn>
                `
            }).join("") : ""
            presetListContainer.innerHTML = presetList
            Array.from(this.querySelectorAll('preset-btn')).forEach((presetBtn, index) => {
                presetBtn.preset = this.#presets[index]
            })

            const presetBtns_bookmarkOn = this.querySelectorAll('[data-bookmark="true"]')
            const presetBtns_bookmarkOff = this.querySelectorAll('[data-bookmark="false"]')
            const sortedPresetBtns_bookmakrOn = Array.from(presetBtns_bookmarkOn).toSorted((a, b) => a.preset.id - b.preset.id)
            const sortedPresetBtns_bookmakrOff = Array.from(presetBtns_bookmarkOff).toSorted((a, b) => a.preset.id - b.preset.id)
            
            const sortedPresetBtns = [...sortedPresetBtns_bookmakrOn, ...sortedPresetBtns_bookmakrOff]

            presetListContainer.replaceChildren(...sortedPresetBtns)
        }
    }
}
customElements.define("preset-choice", PresetChoice)
