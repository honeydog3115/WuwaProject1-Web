import { ATTRIBUTE_IMAGE_URL, RESONATOR_IMAGE_URL, WEAPON_IMAGE_URL } from "../../../config/env"

class ResonatorCard extends HTMLElement{
    #attribute = {}
    #weapon = {}
    #resonator = {}
    #rendering = false

    get attribute(){
        return this.#attribute
    }

    set attribute(data){
        this.#attribute = data
        this.#requestRender()
    }
    
    get weapon(){
        return this.#weapon
    }
    
    set weapon(data){
        this.#weapon = data
        this.#requestRender()
    }
    
    get resonator(){
        return this.#resonator
    }
    
    set resonator(data){
        this.#resonator = data        
        this.#requestRender()
    }

    #requestRender() {
        if(this.#rendering) return;
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