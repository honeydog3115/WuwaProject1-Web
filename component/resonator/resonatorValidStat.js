class ResonatorValidStat extends HTMLElement{
    #validStats = []

    get validStats(){
        return this.#validStats
    }

    set validStats(data){
        this.#validStats = data || []
        this.render()
    }

    connectedCallback(){
        const rowContent = Array(6).fill(0).map((_, index)=>`
            <tr>
                <td>
                    <p class="validStat-${index}">부음속성</p>
                </td>
            </tr>
        `).join("")
    
        this.innerHTML = `
            <div class="validStat-table">
                <table>
                    <tr>
                        <th>
                            유효 부음속성
                        </th>
                    </tr>
                    ${rowContent}
                </table>
            </div>
        `
    }

    render(){
        if(this.#validStats.length > 0){
            Array.from(this.querySelectorAll("p")).map((tag, index)=>{
                tag.textContent = this.#validStats[index] ?? ""
            })
        }
    }
}

customElements.define("resonator-validstat", ResonatorValidStat)