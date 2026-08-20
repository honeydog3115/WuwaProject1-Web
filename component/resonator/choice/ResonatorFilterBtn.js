class ResonatorFilterBtn extends HTMLElement{
    #id = 0
    #name = ""
    #imagePath = ""

    get filterInfo(){
        return {id: this.#id, name: this.#name, imagePath: this.#imagePath}
    }

    set filterInfo({id, name, imagePath}){
        this.#id = id
        this.#name = name
        this.#imagePath = imagePath
    }

    connectedCallback(){
        this.render()
    }

    render(){
        this.innerHTML = `
            <div>
                <button>
                    <img src="${imagePath}" alt="필터 이미지를 불러오는데 실패했습니다.">
                </button>
            </div>
        `
    }
}

customElements.define("resonator-filter-btn", ResonatorFilterBtn)