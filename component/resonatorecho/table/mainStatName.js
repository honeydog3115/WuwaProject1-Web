class MainStatName extends HTMLElement{
    connectedCallback(){
        const optionNumber = 5;
        const options = Array(optionNumber).fill(0).map(() => `
            <li></li>
        `).join('');
        
        this.innerHTML = `
        <div class="mainStatName">
            <ul>
                ${options}
            </ul>
        </div>
        `
    }
}

customElements.define("mainstat-name", MainStatName)