class SonatoEffect extends HTMLElement{
    #sonataEffect = {}

    get sonatoEffect(){
        return this.#sonataEffect
    }

    set sonatoEffect(data){
        this.#sonataEffect = data
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
                    <img src="${imagePath}" alt="${name}의 이미지를 찾지 못했습니다.">
                </div>
                <div>
                    <span>${name}</span>
                </div>
            </div>
        `
    }
}
customElements.define("sonataeffect", SonatoEffect)