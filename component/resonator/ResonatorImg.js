class ResonatorImg extends HTMLElement{
    #DEFAULT_IMAGE = "image/character/unknown.webp"
    connectedCallback(){
        this.render()
    }

    render() {
        this.innerHTML = `
            <div>
                <img src="${this.#DEFAULT_IMAGE}" alt="선택한 공명자 이미지를 불러오는데 실패했습니다.">
            </div>
        `
    }
}

customElements.define("resonator-img", ResonatorImg)