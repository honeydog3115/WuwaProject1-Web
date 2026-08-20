import "../component/resonator/choice/ResonatorCard.js"
import "../component/resonator/choice/ResonatorFilterBtn.js"
import "../component/SearchComponent.js"

class ResonatorChoice extends HTMLAnchorElement{

    render(){
        const starFilter = Array(3).fill(0).map(()=>`
            <resonator-filter-btn></resonator-filter-btn>
        `).join('')
        const attributeFileter = Array(7).fill(0).map(()=>`
            <resonator-filter-btn></resonator-filter-btn>
        `).join('')
        const weaponFilter = Array(6).fill(0).map(()=>`
            <resonator-filter-btn></resonator-filter-btn>
        `).join('')
        const cardList = Array(10).fill().map(()=>`
            <resonator-card></resonator-card>
        `).join('')
        this.innerHTML=`
            <div>
                <div class="search-bar">
                    <search-component></search-component>
                    <div class="star-filter">${starFilter}</div>
                    <div class="attribute-filter">${attributeFileter}</div>
                    <div class="weapon-filter">${weaponFilter}</div>
                </div>
                <div class="card-list">
                    ${cardList}
                </div>
            </div>
        `
    }
}