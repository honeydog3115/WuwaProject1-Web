class FilterBtn extends HTMLElement{
    #imagePath = ""

    get imagePath(){
        return this.#imagePath
    }

    set imagePath(data){
        this.#imagePath = data ?? ""
    }

    connectedCallBack(){
        this.render()
    }

    render(){
        this.innerHTML = `
            <div class="filter">
                <img src"${this.#imagePath}" alt="필터 이미지를 찾을 수 없습니다.">
            </div>
        `
    }
}
customElements.define("filter-btn", FilterBtn)