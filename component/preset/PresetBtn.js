import { ICON_IMAGE_URL } from "../../config/env"

const BOOKMARKON_IMAGE = "bookmarkOn.png"
const BOOKMARKOFF_IMAGE = "bookmarkOff.png"
class PresetBtn extends HTMLElement{
    #preset = {id: 0, name: "", bookmark: false}

    get preset(){
        return this.#preset
    }

    set preset(data){
        this.#preset = data
        this.render()
    }

    connectedCallback(){
        this.render()
        this.addEventListener('click', this.#clickBookmark)
    }

    #clickBookmark = (event) => {
        const imgElement = this.querySelector('img')
        if(event.target === imgElement){
            if(this.#preset.bookmark){
                this.#preset.bookmark = false
                imgElement.src = ICON_IMAGE_URL + BOOKMARKOFF_IMAGE
            }
            else{
                this.#preset.bookmark = true
                imgElement.src = ICON_IMAGE_URL + BOOKMARKON_IMAGE
            }
        }

        this.dispatchEvent(new CustomEvent('render-presetChoice',{
            bubbles: true
        }))
    }

    render() {
        const bookmarkImage = this.#preset.bookmark ? BOOKMARKON_IMAGE:BOOKMARKOFF_IMAGE
        const presetName = this.#preset.name

        this.innerHTML = `
            <div>
                <button>
                    <span>
                        ${presetName}
                    </span>
                    <img src="${ICON_IMAGE_URL}${bookmarkImage}">
                </button>
            </div>
        `
    }
}
customElements.define("preset-btn", PresetBtn)