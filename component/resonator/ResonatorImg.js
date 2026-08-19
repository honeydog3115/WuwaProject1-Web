class ResonatorImg extends HTMLElement{
    connectedCallback(){
        this.render()
    }

    render() {
        this.innerHTML = `
            <div>
                <img src="" alt="선택한 공명자 이미지를 불러오는데 실패했습니다.">
            </div>
        `
    }
}

customElements.define("resonator-img", ResonatorImg)