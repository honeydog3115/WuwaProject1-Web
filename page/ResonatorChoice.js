import "../component/FilterItemBtn.js"
import "../component/resonator/choice/ResonatorCard.js"
import "../component/SearchComponent.js"

class ResonatorChoice extends HTMLElement {
    #starNumber = 2
    #resonators = []
    #attributes = []
    #weapons = []
    #dialog = null

    set searchInfo({ resonators: resonators, attributes: attributes, weapons: weapons }) {
        this.#resonators = resonators || []
        this.#attributes = attributes || []
        this.#weapons = weapons || []
        this.render()
    }

    setFilterInfo(filterInfos, targetParentClass){
        if(filterInfos.length > 0){
            const parent = this.querySelector("."+targetParentClass)
            const filters = parent.children
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
        const cardList = this.#resonators.length !== 0 
            ? this.#resonators.map((resonator) => `
                <resonator-card></resonator-card>
            `).join('') : ""

        this.innerHTML = `
            <dialog>
                <div class="search-bar">
                    <search-component></search-component>
                    <div class="star-filter">${starFilter}</div>
                    <div class="attribute-filter">${attributeFilter}</div>
                    <div class="weapon-filter">${weaponFilter}</div>
                </div>
                <div class="card-list">
                    ${cardList}
                </div>
            </dialog>
        `
        this.#dialog = this.querySelector('dialog')
        this.#dialog.addEventListener('click', this.#handleDialogClose)
        this.setFilterInfo(this.#attributes, "attribute-filter")
        this.setFilterInfo(this.#weapons, "weapon-filter")
        if(this.#resonators.length > 0){
            const parent = this.querySelector(".card-list")
            const cardList = parent.children
            this.#resonators.map((resonator, index)=>{
                cardList[index].resonator = resonator
                cardList[index].attribute = this.#attributes.find(attribute=> attribute.id === resonator.attributeId) 
                cardList[index].weapon = this.#weapons.find(weapon=> weapon.id === resonator.weaponId) 
            })
        }
    }
}
customElements.define("resonator-choice", ResonatorChoice)