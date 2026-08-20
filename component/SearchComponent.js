class SearchComponent extends HTMLElement{
    #searchInfo = {}

    get searchInfo(){
        return this.#searchInfo
    }

    set searchInfo(data){
        this.#searchInfo = data || {};
        this.render()
    }

    connectedCallback(){
        this.render()
    }

    render(){
            const { imagePath = '', action = '' } = this.#searchInfo;
            this.innerHTML = `
            <search>
                <form action="${action}" method="get">
                    <!--버튼과 인풋을 합쳐서 하나로 보이게 만들거임.-->
                    <div>
                        <button type="submit">
                            <img src="${imagePath}">
                        </button>
                        <input type="search" name="name">
                    </div>
                </form>
            </search>
        `
    }
}
customElements.define("search-component",SearchComponent)