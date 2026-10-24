class ResonatorEchoDetect extends HTMLElement{
    #dialog = null
    #canvas = null
    #video = null
    #mediaStream = null
    #ctx = null
    #animationFrameId = null

    connectedCallback(){
        this.render()
        this.addEventListener('click', this.#handleDialogClose)
        this.#dialog = this.querySelector('dialog')
        this.#canvas = this.querySelector('canvas')
        this.#video = this.querySelector('video')
        this.#ctx = canvas.getContext('2d');
    }

    showDialog(){
        if(this.#dialog && !this.#dialog.open){
            this.#dialog.showModal()
        }
        this.#echoDetect()
    }

    closeDialog(){
        if(this.#dialog && this.#dialog.open){
            this.#dialog.close()
        }
    }

    #handleDialogClose = (event) => {
        const rect = this.#dialog.getBoundingClientRect()
        const isClickOutside = (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
        );

        if (isClickOutside) {
            this.closeDialog();
        }
    }

    #echoDetect = async () => {
        this.#mediaStream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        cursor: 'never',
                        width: { max: 1920 },
                        height: { max: 1080 },
                        frameRate: { max: 30 }
                    },
                    audio: false
                });
        video.srcObject = mediaStream

        requestAnimationFrame(this.#scanLoop)
    }
    
    #scanLoop = () => {
        if(this.#mediaStream) return
        
        this.#canvas.width = this.#video.videoWidth;
        this.#canvas.height = this.#video.videoHeight;
        
        this.#ctx.drawImage(this.#video, 0, 0, this.#canvas.width, this.#canvas.height)

        this.#animationFrameId = requestAnimationFrame(this.#scanLoop)
    }

    #deleteResource = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        this.#dialog = null
        this.#canvas = null
        this.#video.srcObject = null
    }

    render(){
        if(this.innerHTML === ''){
            this.innerHTML = `
                <dialog>
                    <video class="display-none width-80vw height-80vh" autoplay playsinline></video>
                    <canvas></canvas>
                </dialog>
            `
        }
    }
}

customElements.define('resonatorecho-detect', ResonatorEchoDetect)