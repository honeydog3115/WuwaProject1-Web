import { ICON_IMAGE_URL } from "../config/env";

class SearchComponent extends HTMLElement{
    #searchInfo = {}
    #searchData = ""
    #SEARCH_ICON_IMG = "Search.png"

    get searchInfo(){
        return this.#searchInfo
    }

    set searchInfo({action = "", method = "GET", onsubmit}){
        this.#searchInfo = {action: action, method: method, onsubmit: onsubmit};
        this.render()
    }

    get searchData(){
        const form = this.querySelector("form")
        this.#searchData = form.name.value
        return this.#searchData
    }

    connectedCallback(){
        this.render()
    }

    render(){
        const { action, method, onsubmit} = this.#searchInfo;
        this.innerHTML = `
            <search>
                <form action="${action}" method="${method}">
                    <!--버튼과 인풋을 합쳐서 하나로 보이게 만들거임.-->
                    <div>
                        <button type="submit">
                            <img src="${ICON_IMAGE_URL}${this.#SEARCH_ICON_IMG}">
                        </button>
                        <input type="search" name="name">
                    </div>
                </form>
            </search>
        `
        const form = this.querySelector('form');
        form.onsubmit = onsubmit;
    }
}
customElements.define("search-component",SearchComponent)