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
        const rowContent = this.#validStats.map((validStat)=>`
            <tr>
                <td><p>${validStat.name}</p></td>
            </tr>
        `).join('')

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