import { DEFAULT_ECHO_IMG_URL, ECHO_IMAGE_URL } from "../../config/env"

class EchoCard extends HTMLElement{
    #echo = {}

    get echo(){
        return this.#echo
    }

    set echo(data){
        this.#echo = data
        this.render()
    }

    connectedCallback(){
        this.addEventListener('click', this.#clickEvent)
        this.render()
    }

    #clickEvent = (event) => {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('choice-echo', {
            detail : {
                echo : this.#echo
            },
            bubbles : true,
            composed : true,
        }))
    }

    render(){
        const imagePath = this.#echo.imagePath ?? "" !== "" ? ECHO_IMAGE_URL + this.#echo.imagePath : DEFAULT_ECHO_IMG_URL
        const name = this.#echo.name ?? "기본 에코"
        const id = this.#echo.id ?? 0
        this.innerHTML = `
            <div class="echo-${id}">
                <div>
                    <img src="${imagePath}" alt="${name}의 ${imagePath} 이미지를 찾지 못했습니다.">
                </div>
                <div>
                    <span>${name}</span>
                </div>
            </div>
        `
    }
}
customElements.define("echo-card", EchoCard)