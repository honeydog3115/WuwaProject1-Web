import { SONATAEFFECT_IMAGE_URL } from "../../config/env"

class SonataEffect extends HTMLElement{
    #sonataEffect = {}

    get sonataEffect(){
        return this.#sonataEffect
    }

    set sonataEffect(data){
        this.#sonataEffect = data
        this.render()
    }

    connectedCallback(){
        this.render()
        this.addEventListener('click', this.#clickEvent)
    }

    #clickEvent = (event) => {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('click-filter',{
            bubbles : true
        }))
    }

    render(){
        const id = this.#sonataEffect.id ?? 0
        const name = this.#sonataEffect.name ?? ""
        const imagePath = this.#sonataEffect.imagePath ?? ""
        this.innerHTML = `
            <div class="sonataEffect-${id}">
                <div>
                    <img src="${SONATAEFFECT_IMAGE_URL}${imagePath}" alt="${name}의 이미지를 찾지 못했습니다.">
                </div>
                <div>
                    <span>${name}</span>
                </div>
            </div>
        `
    }
}
customElements.define("sonata-effect", SonataEffect)