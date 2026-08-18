class ResonatorEchoTable extends HTMLElement{
    connectedCallback(){
        const rowNumber = 5;
        const substatRows = Array(rowNumber).fill(0).map(() => `
            <tr>
                <td><substat-name></substat-name></td>
                <td><substat-value></substat-value></td>
            </tr>
        `).join('');

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