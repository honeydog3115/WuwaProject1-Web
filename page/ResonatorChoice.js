import "../component/resonator/choice/ResonatorCard.js"
import "../component/resonator/choice/ResonatorFilterBtn.js"
import "../component/SearchComponent.js"

class ResonatorChoice extends HTMLAnchorElement{
    #starNumber = 0
    #attributeNumber = 0
    #weaponNumber = 0
    #resonatorNumber = 0

    render(){
        const starFilter = Array(starNumber).fill(0).map(()=>`
            <resonator-filter-btn></resonator-filter-btn>
        `).join('')
        const attributeFileter = Array(attributeNumber).fill(0).map(()=>`
            <resonator-filter-btn></resonator-filter-btn>
        `).join('')
        const weaponFilter = Array(weaponNumber).fill(0).map(()=>`
            <resonator-filter-btn></resonator-filter-btn>
        `).join('')
        const cardList = Array(resonatorNumber).fill(0).map(()=>`
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