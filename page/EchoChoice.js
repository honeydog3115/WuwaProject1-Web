import { getEchos } from "../api/echoApi.js"
import "../component/FilterBtn.js"
import "../component/SearchComponent.js"
import "../component/echo/EchoCard.js"
import "../component/echo/SonataEffect.js"

class EchoChoice extends HTMLElement{
    //객체 배열
    #sonataEffects = []
    #echos = []
    #rendering = false
    #dialog = ""

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
        this.addEventListener('click', this.#handleDialogClose)
        this.#initData()
    }

    #initData = async () => {
        const [echos] = await Promise.all([getEchos()])
        this.#echos = echos
        this.#sonataEffects = this.#echos.map((echo)=>{
            const { id, name, imagePath } = echo
            return { id, name, imagePath }
        })
        this.render()
    }

    showDialog(){
        if(this.#dialog && !this.#dialog.open){
            this.#dialog.showModal()
        }
    }

    closeDialog(){
        if(this.#dialog && this.#dialog.open){
            this.#dialog.close()
        }
    }

    #handleDialogClose = (event) => {
        const rect = this.#dialog.getBoundingClientRect()
        const isClickOutside = (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
        );

        if (isClickOutside) {
            this.closeDialog();
        }
    }

    

    render(){
        const echoCardList = this.#sonataEffects.map((sonataeffect)=>{
            const echos = this.#echos.find((echo)=>echo.id === sonataeffect.id).echos
            console.log("echo", echos)
            const echoCard = echos.map((echo)=>`
                <echo-card></echo-card>
            `).join("")
            return `
                <div>
                    <sonata-effect></sonata-effect>
                </div>
                <div>
                    ${echoCard}
                </div>
            `}).join("")

        this.innerHTML = `
            <dialog class="width-80vw height-80vw">
                <div>
                    <search-componenet></search-componenet>
                    <filter-btn></filter-btn>
                    ${echoCardList}
                </div>
            </dialog>
        `

        this.#dialog = this.querySelector('dialog')
        if(this.#echos.length > 0){
            const sonataeffectElements = Array.from(this.querySelectorAll('sonata-effect'))
            sonataeffectElements.map((sonataeffectElement, index)=>{
                sonataeffectElement.sonataEffect = this.#sonataEffects[index]
            })

            const echoCardList = Array.from(this.querySelectorAll('echo-card'))
            const echos = this.#echos.flatMap((echo)=>{
                return echo.echos
            })
            echoCardList.map((echoCard, index) => {
                echoCard.echo = echos[index]
            })
        }
    }
}
customElements.define("echo-choice", EchoChoice)