import { getEchos } from "../api/echoApi.js"
import "../component/FilterBtn.js"
import "../component/SearchComponent.js"
import "../component/echo/EchoCard.js"
import "../component/echo/SonataEffect.js"
import "./EchoFilter.js"

class EchoChoice extends HTMLElement{
    //객체 배열
    #sonataEffects = []
    #echos = []
    #rendering = false
    #dialog = ""
    #filteredEchos = null
    #filterStat = {
        "cost" : ["1COST","3COST","4COST"],
        "sonataEffect" : this.#sonataEffects.map((_, index)=>index+1),
    }
    #searchData = ""

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
    
    async connectedCallback(){
        this.render()
        this.addEventListener('click', this.#handleDialogClose)
        this.addEventListener('click-filter', this.#clickFilter)
        await this.#initData()

        const echoFilter = this.querySelector('echo-filter')
        echoFilter.sonataEffects = this.#sonataEffects
        this.#dialog = this.querySelector('dialog')
        const searchComponent = this.querySelector('search-component')
        searchComponent.searchInfo = {action: "", method: "GET", onsubmit: this.#onSubmit}
    }

    #initData = async () => {
        const [echos] = await Promise.all([getEchos()])
        this.#echos = echos
        this.#sonataEffects = this.#echos.map((echo)=>{
            const { id, name, imagePath } = echo
            return { id, name, imagePath }
        })
        this.#filterStat.sonataEffect = this.#sonataEffects.map((_, index)=>index+1)
        this.render()
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

    #clickFilter = (event) => {
        event.preventDefault();
        if(event.target.tagName.toLowerCase() == 'sonata-effect' && !event.target.classList.contains('filter'))
            return

        if(event.target.closest('echo-choice')){
            if(event.target.parentElement.classList.contains('cost-filter')){
                this.#filterStat.cost = Array.isArray(event.target.filterInfo.id) 
                ? [...event.target.filterInfo.id] 
                : [event.target.filterInfo.id]
            }
            
            if(event.target.parentElement.classList.contains('sonataEffect-filter')){
                if([event.target.sonataEffect.id].every((id, index) => id === this.#filterStat.sonataEffect[index])
                && this.#filterStat.sonataEffect.length === 1){
                    this.#filterStat.sonataEffect = this.#sonataEffects.map((_, index)=>index+1)
                }
                else{
                    this.#filterStat.sonataEffect = [event.target.sonataEffect.id]
                }
            }
        }

        this.#filtering()
    }

    #onSubmit = (event) => {
        const searchComponent = this.querySelector('search-component')
        this.#searchData = searchComponent.searchData

        this.#filtering()
    }
    
    #filtering = () => {
        this.#filteredEchos = this.#echos
        .map((sonataEchos) => ({ 
            ...sonataEchos,
            echos : sonataEchos.echos
            .filter(echo => this.#filterStat.cost.includes(echo.cost) && echo.name.toLocaleLowerCase().includes(this.#searchData))
            // .filter(echo => echo.name.toLocaleLowerCase().includes(this.#searchData))
        }))
        .filter(sonataEchos => sonataEchos.echos.length > 0)
        .filter(sonataEchos => this.#filterStat.sonataEffect.includes(sonataEchos.id))

        this.render()
    }

    render(){
        // TODO: 나중에 echo-filter 위치 수정하기.
        if(!this.querySelector('dialog')){
            this.innerHTML = `
                <dialog class="width-80vw height-80vw">
                    <div>
                        <search-component></search-component>
                        <echo-filter></echo-filter>
                    </div>
                    <div class="echo-list">
                        <filter-btn></filter-btn>
                        <div class="echo-card-container"></div>
                    </div>
                </dialog>
            `
        }
        const targetEchos = this.#filteredEchos === null ? this.#echos : this.#filteredEchos
        const echoCardList = targetEchos.map((targetEcho)=>{
            const echoCard = targetEcho.echos.map((echo)=>`
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

        const container = this.querySelector('.echo-card-container');
        if (container) {
            container.innerHTML = echoCardList;
        }

        if(targetEchos.length > 0){
            const echoCardListParent = this.querySelector('.echo-list')
            // sonata-effect를 filter에서도 사용해서 sonataEffects 의 개수보다 엘리먼트 수가 많이 잡힘.
            const sonataEffectElements = Array.from(echoCardListParent.querySelectorAll('sonata-effect'))
            sonataEffectElements.map((sonataEffectElement, index)=>{
                const { echos, ...sonataEffect } = targetEchos[index]
                sonataEffectElement.sonataEffect = sonataEffect
            })

            const echoCardList = Array.from(this.querySelectorAll('echo-card'))
            const echos = targetEchos.flatMap((echo)=>{
                return echo.echos
            })
            echoCardList.map((echoCard, index) => {
                echoCard.echo = echos[index]
            })
        }
    }
}
customElements.define("echo-choice", EchoChoice)