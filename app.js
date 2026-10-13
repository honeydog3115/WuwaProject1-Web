import "./page/PresetChoice.js";
import "./page/ResonatorEcho.js";

const routes = {
    "/resonatorEcho": `<resonator-echo></resonator-echo>`
}

function router(){
    const path = location.hash.replace('#', '') || '/resonatorEcho';
    const content = routes[path] || `<resonator-echo></resonator-echo>`
    const $app = document.getElementById("app")
    const $aside = document.querySelector("aside")

    $app.innerHTML = content
    $aside.innerHTML = `<preset-choice></preset-choice>`
}

window.addEventListener("hashchange", router)
document.addEventListener("DOMContentLoaded", router)