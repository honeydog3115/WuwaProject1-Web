import "../component/FilterBtn.js"
import "../component/SearchComponent.js"
import "../component/echo/EchoCard.js"
import "../component/echo/SonataEffect.js"

class EchoChoice extends HTMLElement{
    //객체 배열
    #sonataEffects = []
    #echos = []
    #rendering = false

    set sonataeffects(data){
        this.#sonataEffects = data
        this.requestRendering()
    }
    
    set echos(data){
        this.#echos = data
        this.requestRendering()
    }
    
    requestRendering(){
        if(this.#rendering) return

        this.#rendering = true
        
        queueMicrotask(()=>{
            this.render()
            this.#rendering = false
        })
    }
    
    connectedCallback(){
        this.render()
    }

    render(){
        const echoCardList = this.#sonataEffects.map((sonataeffect)=>{
            const echos = this.#echos.filter(echo=>echo.sonataeffectId === sonataeffect.id)
            const echoCard = echos.map((echo)=>`
                <echo-card></echo-card>
            `).join("")
            return `
                <div>
                    <div>
                        <sonataeffect></sonataeffect>
                    </div>
                    <div>
                        ${echoCard}
                    </div>
                </div>
            `}).join("")

        this.innerHTML = `
            <div>
                <search-componenet></search-componenet>
                <filter-btn></filter-btn>
                ${echoCardList}
            </div>
        `
    }
}
customElements.define("echo-choice", EchoChoice)