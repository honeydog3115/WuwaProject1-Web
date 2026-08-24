class ResonatorValidStat extends HTMLElement{
    #validStats = []

    get validStats(){
        return this.#validStats
    }

    set validStats(data){
        this.#validStats = data
        this.render()
    }

    connectedCallback(){
        this.render()
    }

    render(){
        const rowContent = Array(6).fill(0).map((_, index)=>`
            <tr>
                <td>
                    <p>${this.#validStats[index]?.name ?? "부음 속성"}</p>
                </td>
            </tr>
        `).join("")

        this.innerHTML = `
            <div>
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
}

customElements.define("resonator-validstat", ResonatorValidStat)