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
        this.innerHTML = `
            <div>
                <img src="${this.#attribute.image}" alt="">
                <img src="${this.#weapon.image}" alt="">
                <img src="${this.#resonator.image}" alt="">
                <span>${this.#resonator.name}</span>
            </div>
        `
    }
}