class EchoCard extends HTMLElement{
    #echo = {}

    get echo(){
        return this.#echo
    }

    set echo(data){
        this.#echo = data
        this.render()
    }

    conneectedCallBack(){
        this.render()
    }

    render(){
        const imagePath = this.#echo.imagePath ?? ""
        const name = this.#echo.name ?? ""
        const id = this.#echo.id ?? 0
        this.innerHTML = `
            <div class="echo-${id}">
                <div>
                    <img src="${imagePath}" alt="${name}의 이미지를 찾지 못했습니다.">
                </div>
                <div>
                    <span>${name}</span>
                </div>
            </div>
        `
    }
}
customElements.define("echo-card", EchoCard)