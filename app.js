import "./page/ResonatorEcho.js";

const routes = {
    "/resonatorEcho": `<resonator-echo></resonator-echo>`
}

function router(){
    const path = location.hash.replace('#', '') || '/resonatorEcho';
    const content = routes[path] || `<resonator-echo></resonator-echo>`
    const $app = document.getElementById("app")

    $app.innerHTML = content
}

window.addEventListener("hashchange", router)
window.addEventListener("DOMContentLoaded", router)