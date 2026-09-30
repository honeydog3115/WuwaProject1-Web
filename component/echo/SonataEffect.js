import { SONATAEFFECT_IMAGE_URL } from "../../config/env"

class SonataEffect extends HTMLElement{
    #sonataEffect = {}

    get sonatoEffect(){
        return this.#sonataEffect
    }

    set sonataEffect(data){
        this.#sonataEffect = data
        this.render()
    }

    connectedCallBack(){
        this.render()
    }

    render(){
        const id = this.#sonataEffect.id ?? 0
        const name = this.#sonataEffect.name ?? ""
        const imagePath = this.#sonataEffect.imagePath ?? ""
        this.innerHTML = `
            <div class="sonataeffect-${id}">
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