import "./MainStatName.js"
import "./MainStatValue.js"
import "./ResonatorEchoChoice.js"
import "./SubStatName.js"
import "./SubStatValue.js"

class ResonatorEchoTable extends HTMLElement{
    #ROW_NUM = 5;
    substatRows = Array(this.#ROW_NUM).fill(0).map(() => `
        <tr>
            <td><substat-name></substat-name></td>
            <td><substat-value></substat-value></td>
        </tr>
    `).join('');
    
    connectedCallback(){
        this.render()
    }

    render() {
        this.innerHTML = `
            <div>
                <table>
                    <tr>
                        <th>
                            <choice-resonatorecho></choice-resonatorecho>
                        </th>
                    </tr>
                    <tr>
                        <td>
                            <mainstat-name></mainstat-name>
                        </td>
                        <td>
                            <mainstat-value></mainstat-value>
                        </td>
                    </tr>
                    <tr>
                        ${substatRows}
                    </tr>
                </table>
            </div>
        `
    }
}

customElements.define("resonatorecho-table", ResonatorEchoTable)