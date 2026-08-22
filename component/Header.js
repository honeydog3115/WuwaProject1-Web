class HeaderComponent extends HTMLElement{
    #login = false
    #helpImagePath = ""
    #loginImagePath = ""
    #logOutImagePath = ""

    connectedCallBack(){
        this.render()
    }

    render(){
        const loginLogout = this.#login
        ? `<img src="${this.#loginImagePath}" alt="로그인 이미지를 찾지 못 했습니다.">`
        : `<img src="${this.#logOutImagePath}" alt="로그아웃 이미지를 찾지 못 했습니다.">`

        this.innerHTML = `
            <header>
                <img src="${this.#helpImagePath}" alt="도움말 이미지를 찾지 못 했습니다.">
                ${loginLogout}
            </header>
        `
    }
}
customElements.define("header-component", HeaderComponent)