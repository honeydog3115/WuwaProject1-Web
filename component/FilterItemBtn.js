import { ATTRIBUTE_IMAGE_URL, WEAPON_IMAGE_URL } from "../config/env"

class FilterItemBtn extends HTMLElement{
    #filterInfo = {id: 0, name: "", imagePath: ""}
    #imageMap = {
        "attribute-filter": ATTRIBUTE_IMAGE_URL,
        "weapon-filter": WEAPON_IMAGE_URL, 
    }

    get filterInfo(){
        return this.#filterInfo
    }

    set filterInfo(data){
        this.#filterInfo = data || {}
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
        const imageUrl = this.#imageMap[this.parentElement.className] || ""
        const imagePath = this.#filterInfo.imagePath || ""
        const name = this.#filterInfo.name
        const filterContent = imagePath !== ""
        ? `<img src="${imageUrl}${imagePath}" alt="필터 이미지를 불러오는데 실패했습니다.">`
        :`<span>${name}</span>`
        
        this.innerHTML = `
            <div>
                <button>
                    ${filterContent}
                </button>
            </div>
        `
    }
}

customElements.define("filter-item-btn", FilterItemBtn)