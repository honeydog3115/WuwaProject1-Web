import "../component/FilterItemBtn.js"
import "../component/echo/SonataEffect.js"

class EchoFilter extends HTMLElement{
    #costNumber = 3
    #sonataEffects = []
    #costs = [{id: ["1COST","3COST","4COST"], name: "ALL"}, {id: "1COST", name: "1COST"}, {id: "3COST", name: "3COST"}, {id: "4COST", name: "4COST"}]

    set sonataEffects(data){
        this.#sonataEffects = data
        this.render()
    }

    connectedCallBack(){
        this.render()
    }

    #setFilterInfo(filterInfos, targetParentClass){
        if(filterInfos.length > 0){
            const parent = this.querySelector("."+targetParentClass)
            const filters = Array.from(parent.children)
            filterInfos.map((info, index)=>{
                filters[index].filterInfo = info
            })
        }
    }
    
    render(){
        const costFilter = Array(this.#costNumber+1).fill(0).map(()=>`
            <filter-item-btn></filter-item-btn>
        `).join("")
        const sonataEffectFilter = this.#sonataEffects.length !== 0
        ? this.#sonataEffects.map((sonataEffect)=>`
            <sonata-effect class="filter"></sonata-effect>
        `).join("") : ""

        this.innerHTML = `
            <div>
                <div class="cost-filter">
                    ${costFilter}
                </div>
                <div class="sonataEffect-filter">
                    ${sonataEffectFilter}
                </div>
            </div>
        `
        this.#setFilterInfo(this.#costs, "cost-filter")
        const sonataEffectElements = Array.from(this.querySelectorAll('sonata-effect'))
        sonataEffectElements.map((sonataEffectElement, index) => {
            sonataEffectElement.sonataEffect = this.#sonataEffects[index]
        })

    }
}
customElements.define("echo-filter", EchoFilter)