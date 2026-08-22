import "../component/FilterItemBtn.js"
import "../component/echo/SonataEffect.js"

class EchoFilter extends HTMLElement{
    #costNumber = 3
    #sonataeffects = []

    set sonataeffects(data){
        this.#sonataeffects = data
        this.render()
    }

    connectedCallBack(){
        this.render()
    }

    render(){
        const costFilter = Array(this.#costNumber+1).fill(0).map(()=>`
            <filter-item-btn></filter-item-btn>
        `).join("")
        const sonataeffectFilter = this.#sonataeffects.length !== 0
        ? this.#sonataeffects.map((sonataeffect)=>`
            <sonataeffect></sonataeffect>
        `).join("") : ""

        this.innerHTML = `
            <di>
                <div>
                    ${costFilter}
                </div>
                <div>
                    ${sonataeffectFilter}
                </div>
            </di>
        `
    }
}
customElements.define("echo-filter", EchoFilter)