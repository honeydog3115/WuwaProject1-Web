import { ATTRIBUTE_IMAGE_URL, RESONATOR_IMAGE_URL, WEAPON_IMAGE_URL } from "../../../config/env"

class ResonatorCard extends HTMLElement{
    #resonator = {}

    get resonator(){
        return this.#resonator
    }
    
    set resonator(data){
        this.#resonator = data        
        this.render()
    }

    connectedCallback(){
        this.render()
    }

    render(){
        const attribute = this.#resonator ? this.#resonator.attribute : undefined 
        const weapon = this.#resonator ? this.#resonator.weapon : undefined
        
        this.innerHTML = `
            <div>
                <img src="${ATTRIBUTE_IMAGE_URL}${attribute.imagePath}" alt="">
                <img src="${WEAPON_IMAGE_URL}${weapon.imagePath}" alt="">
                <img src="${RESONATOR_IMAGE_URL}${this.#resonator.imagePath}" alt="">
                <span>${this.#resonator.name}</span>
            </div>
        `
    }
}
customElements.define("resonator-card", ResonatorCard)