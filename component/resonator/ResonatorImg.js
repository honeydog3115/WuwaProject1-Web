class ResonatorImg extends HTMLElement{
    #IMG_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL

    #DEFAULT_CHARACTER_IMG = "character/unknown.webp"
    #CHARACTER_IMG_PATH = this.#IMG_BASE_URL + this.#DEFAULT_CHARACTER_IMG

    connectedCallback(){
        this.render()
    }

    render() {
        this.innerHTML = `
            <div>
                <img src="${this.#CHARACTER_IMG_PATH}" alt="선택한 공명자 이미지를 불러오는데 실패했습니다.">
            </div>
        `
    }
}

customElements.define("resonator-img", ResonatorImg)