import { getAttributes } from "../api/attributeApi.js"
import { getResonators } from "../api/resonatorApi.js"
import { getWeapons } from "../api/weaponApi.js"
import "../component/FilterItemBtn.js"
import "../component/resonator/choice/ResonatorCard.js"
import "../component/SearchComponent.js"

class ResonatorChoice extends HTMLElement {
    #starNumber = 2
    #resonators = []
    #attributes = []
    #weapons = []
    #dialog = null
    #filterMapping = {
        "attribute-filter" : (resonator, attribute) => resonator.attribute.id === attribute.id,
        "weapon-filter" : (resonator, weapon) => resonator.weapon.id === weapon.id,
        "star-filter" : (resonator, star) => resonator.star === star,
    }
    #filteredResonators = []

    set searchInfo({ resonators: resonators, attributes: attributes, weapons: weapons }) {
        this.#resonators = resonators || []
        this.#attributes = attributes || []
        this.#weapons = weapons || []
        this.render()
    }

    setFilterInfo(filterInfos, targetParentClass){
        if(filterInfos.length > 0){
            const parent = this.querySelector("."+targetParentClass)
            const filters = Array.from(parent.children)
            filterInfos.map((info, index)=>{
                filters[index].filterInfo = info
            })
        }
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

    connectedCallback() {
        this.addEventListener("click-filter", this.#clickFilter)
        this.render()
        this.#initData()
    }


    #initData = async () => {
        const [resoantors, attributes, weapons] = await Promise.all([getResonators(), getAttributes(), getWeapons()])
        this.#resonators = resoantors
        this.#attributes = attributes
        this.#weapons = weapons
        this.render()
    }

    // #getResonators = async()=>{
    //     const resonators = await getResonators()
    //     this.#resonators = resonators
    //     this.render()
    // }
    
    // #getAttributes = async()=>{
    //     const attributes = await getAttributes()
    //     this.#attributes = attributes
    //     this.render()
    // }

    // #getWeapons = async() => {
    //     const weapons = await getWeapons()
    //     this.#weapons = weapons
    //     this.render()
    // }

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
        const filter =  event.target.closest("[class$=-filter]")
        const mappingFunction = this.#filterMapping[filter.className]
        const filteredResonators = this.#resonators.filter(
            (resoantor) => mappingFunction(resoantor, event.target.filterInfo)    
        )
        this.#filteredResonators = filteredResonators
        const cardList = Array.from(this.querySelectorAll("resonator-card"))
        const filteredIds = this.#filteredResonators.map((resonator)=>resonator.id)
        cardList.forEach(
            (card)=>{
                const resonator = card.resonator
                if(filteredIds.includes(resonator.id))
                    card.style.display = "flex"
                else
                    card.style.display = "none"
            }
        )
    }

    render() {
        const starFilter = Array(this.#starNumber + 1).fill(0).map(() => `
            <filter-item-btn></filter-item-btn>
        `).join('')
        const attributeFilter = this.#attributes.length !== 0
            ? this.#attributes.map((attribute) => `
                <filter-item-btn data-id="${attribute.id}"></filter-item-btn>
            `).join('') : ""
        const weaponFilter = this.#weapons.length !== 0
            ? this.#weapons.map((weapon) => `
                <filter-item-btn data-id="${weapon.id}"></filter-item-btn>
            `).join('') : ""
        const resonatorData = this.#filteredResonators.length !== 0 ? this.#filteredResonators : this.#resonators
        const cardList = resonatorData.length !== 0 
            ? this.#resonators.map((resonator) => `
                <resonator-card></resonator-card>
            `).join('') : ""

        this.innerHTML = `
            <dialog class="width-80vw height-80vw">
                <div class="search-bar">
                    <search-component></search-component>
                    <div class="star-filter">${starFilter}</div>
                    <div class="attribute-filter">${attributeFilter}</div>
                    <div class="weapon-filter">${weaponFilter}</div>
                </div>
                <div class="card-list width-60vw">
                    ${cardList}
                </div>
            </dialog>
        `
        this.#dialog = this.querySelector('dialog')
        this.#dialog.addEventListener('click', this.#handleDialogClose)
        this.setFilterInfo(this.#attributes, "attribute-filter")
        this.setFilterInfo(this.#weapons, "weapon-filter")
        if(this.#resonators.length > 0){
            const cardList = Array.from(this.querySelectorAll("resonator-card"))
            this.#resonators.map((resonator, index)=>{
                cardList[index].resonator = resonator
                // cardList[index].attribute = this.#attributes.find(attribute=> attribute.id === resonator.attributeId) 
                //cardList[index].weapon = this.#weapons.find(weapon=> weapon.id === resonator.weaponId) 
            })
        }
        
    }
}
customElements.define("resonator-choice", ResonatorChoice)