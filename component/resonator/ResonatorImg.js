import { html, render } from 'lit';

class ResonatorImg extends HTMLElement{
    #imgBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

    #property = {
        attributeImg : import.meta.env.VITE_DEFAULT_ATTRIBUTE_IMG,
        resonatorImg : import.meta.env.VITE_DEFAULT_RESONATOR_IMG,
        resonatorName : "공명자"
    };

    set property(data){
        this.#property = {...this.#property, ...data}
        this.render()
    }

    connectedCallback(){
        this.render()
    }

    render() {
        const {attributeImg, resonatorImg, resonatorName} = this.#property
        const imgBaseUrl = this.#imgBaseUrl

        const template = html`
            <div>
                <img class="attribute" src="${imgBaseUrl}${attributeImg}" alt="속성 이미지를 불러오는데 실패했습니다.">
                <img class="resonator" src="${imgBaseUrl}${resonatorImg}" alt="선택한 공명자 이미지를 불러오는데 실패했습니다.">
                <span>${resonatorName}</span>
            </div>
        `
        render(template, this)
    }
}

customElements.define("resonator-img", ResonatorImg)