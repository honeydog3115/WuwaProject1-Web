class ResonatorFilterBtn extends HTMLElement{
    // static get observedAttributes(){
    //     return ['data-target']
    // }

    #filterInfo = {id: 0, name: "", imagePath: ""}

    get filterInfo(){
        return this.#filterInfo
    }

    set filterInfo(data){
        this.#filterInfo = data || {}
        // const jsonString = JSON.stringify(this.#filterInfo)
        // // 다를 때만 setAttribute를 호출해서 setAttribute와 setter가 서로 무한 호출하는 것을 막음
        // if (this.getAttribute("data-target") !== jsonString)
        //     this.setAttribute("data-target", jsonString)
        this.render()
    }

    connectedCallback(){
        this.render()
    }

    // attributeChangedCallback(name, oldValue, newValue){
    //     if(oldValue !== newValue && name == "data-target"){
    //         this.filterInfo = JSON.parse(newValue || {})
    //     }
    // }

    render(){
        const imagePath = this.#filterInfo.imagePath
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