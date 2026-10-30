import { loadOpenCV } from "../util/opencvLoader.js"
class ResonatorEchoDetect extends HTMLElement {
    #dialog = null
    #videoCanvas = null
    #opencvCanvas = null
    #video = null
    #mediaStream = null
    #ctx = null
    #animationFrameId = null
    #cv = null
    #cvReady = null

    async connectedCallback() {
        this.render()
        this.addEventListener('click', this.#handleDialogClose)
        this.#dialog = this.querySelector('dialog')
        this.#videoCanvas = this.querySelector('#videoCanvas')
        this.#opencvCanvas = this.querySelector('#opencvCanvas')
        this.#video = this.querySelector('video')
        this.#ctx = this.#videoCanvas.getContext('2d');
        this.#cvReady = loadOpenCV().then(cv => (this.#cv = cv))
    }

    showDialog() {
        if (this.#dialog && !this.#dialog.open) {
            this.#dialog.showModal()
        }
        this.#videoPlay()
    }

    closeDialog() {
        if (this.#dialog && this.#dialog.open) {
            this.#dialog.close()
        }
        this.#deleteResource()
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

    #videoPlay = async () => {
        await this.#cvReady
        this.#mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: 'never',
                width: { max: 1920 },
                height: { max: 1080 },
                frameRate: { max: 30 }
            },
            audio: false
        });
        this.#mediaStream.getVideoTracks()[0].addEventListener('ended', () => this.closeDialog())

        this.#video.srcObject = this.#mediaStream
        await this.#video.play()

        this.#animationFrameId = this.#video.requestVideoFrameCallback(this.#scanLoop)
    }

    #scanLoop = () => {
        if (!this.#mediaStream) return

        const vw = this.#video.videoWidth;
        const vh = this.#video.videoHeight;

        //아직 프레임이 없으면 다음 프레임에 재시도 
        if (vw === 0 || vh === 0) {
            this.#animationFrameId = this.#video.requestVideoFrameCallback(this.#scanLoop)
            return
        }

        if (this.#videoCanvas.width !== vw) this.#videoCanvas.width = vw
        if (this.#videoCanvas.height !== vh) this.#videoCanvas.height = vh
        this.#ctx.drawImage(this.#video, 0, 0, vw, vh)

        const cv = this.#cv
        try {
            this.#echoDetect()
            // src = cv.imread(this.#videoCanvas)

            // const x = Math.floor(src.cols * 0.72)
            // const y = Math.floor(src.rows * 0.12)
            // const width = Math.floor(src.cols * 0.26)
            // const height = Math.floor(src.rows * 0.40)

            // roiMat = src.roi(new cv.Rect(x, y, width, height))
            // cv.imshow(this.#opencvCanvas, roiMat)
        } catch (e) {
            console.error(e)
        }

        this.#animationFrameId = this.#video.requestVideoFrameCallback(this.#scanLoop)
    }

    // #echoDetect = async () => {
    //     // 1. 이미지 읽기
    //     const src = cv.imread(this.#videoCanvas);
    //     const img = document.createElement('img')
    //     img.src = './image/template/critical_damage.png'
    //     img.classList.add('display-none')
    //     this.appendChild(img)
    //     await img.decode()
    //     const templ = cv.imread(img);

    //     const x = Math.floor(src.cols * 0.72)
    //     const y = Math.floor(src.rows * 0.12)
    //     const width = Math.floor(src.cols * 0.26)
    //     const height = Math.floor(src.rows * 0.40)

    //     const roiMat = src.roi(new cv.Rect(x, y, width, height))

    //     // 2. 그레이스케일 변환 및 에지 추출용 행렬 준비
    //     const graySrc = new cv.Mat();
    //     const grayTempl = new cv.Mat();
    //     const edgeTempl = new cv.Mat();

    //     // Wasm 메모리 해제를 위한 GC 등록 배열
    //     const cleanupList = [roiMat, src, templ, graySrc, grayTempl, edgeTempl];

    //     const kernel = cv.Mat.ones(3, 3, cv.CV_8U);
    //     cleanupList.push(kernel);

    //     try {
    //         // 3. 템플릿 이미지 에지 추출 (글자의 외곽 획만 남김)
    //         cv.cvtColor(templ, grayTempl, cv.COLOR_RGBA2GRAY);
    //         cv.Canny(grayTempl, edgeTempl, 50, 150);
    //         // 원본 이미지 그레이스케일 변환
    //         cv.cvtColor(roiMat, graySrc, cv.COLOR_RGBA2GRAY);

    //         const tWidth = edgeTempl.cols;
    //         const tHeight = edgeTempl.rows;

    //         let bestMatch = {
    //             score: -Infinity,
    //             location: null,
    //             scale: 1.0,
    //             matchedWidth: 0,
    //             matchedHeight: 0
    //         };

    //         // 4. 스케일 범위 탐색 (0.5배부터 1.5배까지 0.1 간격으로 11단계 탐색)
    //         const minScale = 1.5;
    //         const maxScale = 2.0;
    //         const steps = 56;

    //         for (let i = 0; i < steps; i++) {
    //             const scale = minScale + (i / (steps - 1)) * (maxScale - minScale);

    //             // 원본 이미지를 스케일에 맞게 리사이즈
    //             const resizedW = Math.round(roiMat.cols * scale);
    //             const resizedH = Math.round(roiMat.rows * scale);

    //             // 리사이즈된 원본이 템플릿보다 작으면 비교 불가하므로 중단
    //             if (resizedW < tWidth || resizedH < tHeight) {
    //                 continue;
    //             }

    //             const resizedSrc = new cv.Mat();
    //             const edgeSrc = new cv.Mat();
    //             const dst = new cv.Mat();

    //             try {
    //                 // 원본 이미지 리사이즈 & Canny 에지 추출
    //                 const dsize = new cv.Size(resizedW, resizedH);
    //                 cv.resize(graySrc, resizedSrc, dsize, 0, 0, cv.INTER_AREA);
    //                 cv.Canny(resizedSrc, edgeSrc, 50, 150);

    //                 // 템플릿 매칭 수행
    //                 cv.matchTemplate(edgeSrc, edgeTempl, dst, cv.TM_CCOEFF_NORMED);
    //                 const minMax = cv.minMaxLoc(dst);

    //                 // 최고 점수 갱신
    //                 if (minMax.maxVal > bestMatch.score) {
    //                     bestMatch = {
    //                         score: minMax.maxVal,
    //                         location: minMax.maxLoc, // 리사이즈된 이미지 기준 좌상단 좌표
    //                         scale: scale,
    //                         matchedWidth: tWidth,
    //                         matchedHeight: tHeight
    //                     };
    //                 }
    //             } finally {
    //                 // 루프 내부 임시 행렬 즉시 메모리 해제
    //                 resizedSrc.delete();
    //                 edgeSrc.delete();
    //                 dst.delete();
    //             }
    //         }

    //         console.log(`최고 일치 점수: ${(bestMatch.score * 100).toFixed(2)}% (배율: ${bestMatch.scale.toFixed(2)}x)`);

    //         // 5. 검출 임계값(Threshold) 확인 (예: 0.45 이상일 때 유효 매칭으로 간주)
    //         const THRESHOLD = 0.40;
    //         if (bestMatch.score >= THRESHOLD && bestMatch.location) {
    //             // 리사이즈 좌표를 원본 이미지 스케일 기준으로 복원 (좌표 / scale)
    //             const startX = Math.round(bestMatch.location.x / bestMatch.scale);
    //             const startY = Math.round(bestMatch.location.y / bestMatch.scale);
    //             const boxW = Math.round(bestMatch.matchedWidth / bestMatch.scale);
    //             const boxH = Math.round(bestMatch.matchedHeight / bestMatch.scale);

    //             const p1 = new cv.Point(startX, startY);
    //             const p2 = new cv.Point(startX + boxW, startY + boxH);

    //             // 초록색 사각형 표시 [R, G, B, A]
    //             const color = new cv.Scalar(0, 255, 0, 255);
    //             cv.rectangle(roiMat, p1, p2, color, 3, cv.LINE_AA, 0);

    //             // 캔버스에 시각화
    //             cv.imshow(this.#opencvCanvas, roiMat);
    //         } else {
    //             console.warn('일치하는 텍스트/글자를 찾지 못했습니다.');
    //             cv.imshow(this.#opencvCanvas, roiMat);
    //         }

    //     } catch (err) {
    //         console.error('에지 멀티스케일 매칭 실패:', err);
    //     } finally {
    //         // 6. 모든 C++ 행렬 메모리 해제
    //         cleanupList.forEach(mat => mat.delete());
    //     }
    // }

    // #echoDetect = async () => {
    //     // 1. 이미지 읽기
    //     const src = cv.imread(this.#videoCanvas);
    //     const img = document.createElement('img');
    //     img.src = './image/template/resonance_liberation_5px.png';
    //     img.classList.add('display-none');
    //     this.appendChild(img);
    //     await img.decode();
    //     const templ = cv.imread(img);
    //     img.remove(); // DOM 누수 방지

    //     const x = Math.floor(src.cols * 0.72);
    //     const y = Math.floor(src.rows * 0.12);
    //     const width = Math.floor(src.cols * 0.26);
    //     const height = Math.floor(src.rows * 0.40);

    //     const roiMat = src.roi(new cv.Rect(x, y, width, height));

    //     // 2. 그레이스케일 변환 및 에지 추출용 행렬 준비
    //     const graySrc = new cv.Mat();
    //     const grayTempl = new cv.Mat();
    //     const edgeTempl = new cv.Mat();

    //     // 팽창(Dilate)용 3x3 커널 생성
    //     const kernel = cv.Mat.ones(3, 3, cv.CV_8U);

    //     // Wasm 메모리 해제를 위한 GC 등록 배열
    //     const cleanupList = [roiMat, src, templ, graySrc, grayTempl, edgeTempl, kernel];

    //     try {
    //         // 3. 템플릿 이미지 에지 추출 (글자의 외곽 획만 날카롭게 유지)
    //         cv.cvtColor(templ, grayTempl, cv.COLOR_RGBA2GRAY);
    //         cv.Canny(grayTempl, edgeTempl, 50, 150);

    //         // 원본 이미지 그레이스케일 변환
    //         cv.cvtColor(roiMat, graySrc, cv.COLOR_RGBA2GRAY);

    //         const tWidth = edgeTempl.cols;
    //         const tHeight = edgeTempl.rows;

    //         let bestMatch = {
    //             score: -Infinity,
    //             location: null,
    //             scale: 1.0,
    //             matchedWidth: 0,
    //             matchedHeight: 0
    //         };

    //         // 4. 스케일 범위 탐색
    //         // dilate 적용으로 쿠션이 생겼으므로 21단계(약 0.025 간격)로도 충분히 최고점 적중
    //         const minScale = 1.5;
    //         const maxScale = 2.0;
    //         const steps = 26;

    //         for (let i = 0; i < steps; i++) {
    //             const scale = minScale + (i / (steps - 1)) * (maxScale - minScale);

    //             const resizedW = Math.round(roiMat.cols * scale);
    //             const resizedH = Math.round(roiMat.rows * scale);

    //             if (resizedW < tWidth || resizedH < tHeight) {
    //                 continue;
    //             }

    //             const resizedSrc = new cv.Mat();
    //             const edgeSrc = new cv.Mat();
    //             const dst = new cv.Mat();

    //             try {
    //                 // 확대 구간(1.5~2.0배)이므로 INTER_LINEAR 보간 적용
    //                 const dsize = new cv.Size(resizedW, resizedH);
    //                 cv.resize(graySrc, resizedSrc, dsize, 0, 0, cv.INTER_LINEAR);

    //                 // 원본 에지 추출
    //                 cv.Canny(resizedSrc, edgeSrc, 50, 150);

    //                 // ✨ 팽창 연산(dilate) 적용: 원본 글자 선 두께를 1픽셀 확장하여 완충 영역 생성
    //                 cv.dilate(edgeSrc, edgeSrc, kernel, new cv.Point(-1, -1), 1);

    //                 // 템플릿 매칭 수행
    //                 cv.matchTemplate(edgeSrc, edgeTempl, dst, cv.TM_CCORR_NORMED);
    //                 // cv.matchTemplate(edgeSrc, edgeTempl, dst, cv.TM_CCOEFF_NORMED);
    //                 const minMax = cv.minMaxLoc(dst);

    //                 // 최고 점수 갱신
    //                 if (minMax.maxVal > bestMatch.score) {
    //                     bestMatch = {
    //                         score: minMax.maxVal,
    //                         location: minMax.maxLoc,
    //                         scale: scale,
    //                         matchedWidth: tWidth,
    //                         matchedHeight: tHeight
    //                     };
    //                 }
    //             } finally {
    //                 // 루프 내부 임시 행렬 즉시 메모리 해제
    //                 resizedSrc.delete();
    //                 edgeSrc.delete();
    //                 dst.delete();
    //             }
    //         }

    //         console.log(`최고 일치 점수: ${(bestMatch.score * 100).toFixed(2)}% (배율: ${bestMatch.scale.toFixed(2)}x)`);

    //         // 5. 검출 임계값 확인 (dilate 적용 후에는 0.50 이상도 충분히 달성 가능)
    //         const THRESHOLD = 0.45;
    //         if (bestMatch.score >= THRESHOLD && bestMatch.location) {
    //             const startX = Math.round(bestMatch.location.x / bestMatch.scale);
    //             const startY = Math.round(bestMatch.location.y / bestMatch.scale);
    //             const boxW = Math.round(bestMatch.matchedWidth / bestMatch.scale);
    //             const boxH = Math.round(bestMatch.matchedHeight / bestMatch.scale);

    //             const p1 = new cv.Point(startX, startY);
    //             const p2 = new cv.Point(startX + boxW, startY + boxH);

    //             // 초록색 사각형 표시
    //             const color = new cv.Scalar(0, 255, 0, 255);
    //             cv.rectangle(roiMat, p1, p2, color, 3, cv.LINE_AA, 0);

    //             // 캔버스에 시각화
    //             cv.imshow(this.#opencvCanvas, roiMat);
    //         } else {
    //             console.warn(`일치율 미달(${(bestMatch.score * 100).toFixed(2)}%): 대상을 찾지 못했습니다.`);
    //             cv.imshow(this.#opencvCanvas, roiMat);
    //         }

    //     } catch (err) {
    //         console.error('에지 멀티스케일 매칭 실패:', err);
    //     } finally {
    //         // 6. 모든 C++ 행렬 메모리 해제
    //         cleanupList.forEach(mat => mat.delete());
    //     }
    // }


    #echoDetect = async () => {
        const src = cv.imread(this.#videoCanvas);
        const img = document.createElement('img');
        img.src = './image/template/resonance_liberation_5px.png';
        img.classList.add('display-none');
        this.appendChild(img);
        await img.decode();
        const templ = cv.imread(img);
        img.remove();

        const x = Math.floor(src.cols * 0.72);
        const y = Math.floor(src.rows * 0.12);
        const width = Math.floor(src.cols * 0.26);
        const height = Math.floor(src.rows * 0.40);

        const roiMat = src.roi(new cv.Rect(x, y, width, height));

        const graySrc = new cv.Mat();
        const edgeSrc = new cv.Mat();
        const grayTempl = new cv.Mat();

        const cleanupList = [roiMat, src, templ, graySrc, edgeSrc, grayTempl];

        try {
            // 1. 그레이스케일 변환
            cv.cvtColor(roiMat, graySrc, cv.COLOR_RGBA2GRAY);
            cv.cvtColor(templ, grayTempl, cv.COLOR_RGBA2GRAY);

            // 2. 원본 ROI는 루프 밖에서 단 1번만 에지 추출 및 블러(완충) 처리
            cv.Canny(graySrc, edgeSrc, 50, 150);
            // 비대칭 dilate 대신 부드러운 가우시안 블러로 에너지 균형 유지
            cv.GaussianBlur(edgeSrc, edgeSrc, new cv.Size(3, 3), 0);

            let bestMatch = {
                score: -Infinity,
                location: null,
                scale: 1.0,
                matchedWidth: 0,
                matchedHeight: 0
            };

            // 3. 원본을 1.5~2.0배 키우는 대신, 템플릿을 역수(1/2.0 ~ 1/1.5)로 축소하며 탐색
            const minSrcScale = 1.5;
            const maxSrcScale = 2.0;
            const steps = 26;

            for (let i = 0; i < steps; i++) {
                const srcScale = minSrcScale + (i / (steps - 1)) * (maxSrcScale - minSrcScale);
                const templScale = 1.0 / srcScale; // 템플릿 축소 배율 (0.5 ~ 0.667)

                const tWidth = Math.round(grayTempl.cols * templScale);
                const tHeight = Math.round(grayTempl.rows * templScale);

                if (tWidth > edgeSrc.cols || tHeight > edgeSrc.rows || tWidth < 10 || tHeight < 10) {
                    continue;
                }

                const resizedTempl = new cv.Mat();
                const edgeTempl = new cv.Mat();
                const dst = new cv.Mat();

                try {
                    // 템플릿 축소 시에는 INTER_AREA가 글자 형태 보존에 가장 뛰어남
                    cv.resize(grayTempl, resizedTempl, new cv.Size(tWidth, tHeight), 0, 0, cv.INTER_AREA);

                    // 축소된 템플릿에서 에지 추출 후 동일하게 가우시안 블러 적용 (대칭 처리)
                    cv.Canny(resizedTempl, edgeTempl, 50, 150);
                    cv.GaussianBlur(edgeTempl, edgeTempl, new cv.Size(3, 3), 0);

                    // 대칭 처리가 되었으므로 TM_CCOEFF_NORMED가 훨씬 높은 변별력과 점수를 제공함
                    cv.matchTemplate(edgeSrc, edgeTempl, dst, cv.TM_CCOEFF_NORMED);
                    const minMax = cv.minMaxLoc(dst);

                    if (minMax.maxVal > bestMatch.score) {
                        bestMatch = {
                            score: minMax.maxVal,
                            location: minMax.maxLoc,
                            scale: srcScale,
                            matchedWidth: tWidth,
                            matchedHeight: tHeight
                        };
                    }
                } finally {
                    resizedTempl.delete();
                    edgeTempl.delete();
                    dst.delete();
                }
            }

            console.log(`최고 일치 점수: ${(bestMatch.score * 100).toFixed(2)}% (환산 배율: ${bestMatch.scale.toFixed(2)}x)`);

            const THRESHOLD = 0.60; // 점수가 전반적으로 상승하므로 임계값 상향 가능
            if (bestMatch.score >= THRESHOLD && bestMatch.location) {
                // 원본 ROI 기준 좌표이므로 별도의 스케일 나눗셈 없이 즉시 사용 가능
                const p1 = new cv.Point(bestMatch.location.x, bestMatch.location.y);
                const p2 = new cv.Point(
                    bestMatch.location.x + bestMatch.matchedWidth,
                    bestMatch.location.y + bestMatch.matchedHeight
                );

                const color = new cv.Scalar(0, 255, 0, 255);
                cv.rectangle(roiMat, p1, p2, color, 2, cv.LINE_AA, 0);
                cv.imshow(this.#opencvCanvas, roiMat);
            } else {
                console.warn(`일치율 미달(${(bestMatch.score * 100).toFixed(2)}%): 대상을 찾지 못했습니다.`);
                cv.imshow(this.#opencvCanvas, roiMat);
            }

        } catch (err) {
            console.error('에지 멀티스케일 매칭 실패:', err);
        } finally {
            cleanupList.forEach(mat => mat.delete());
        }
    }


    #deleteResource = () => {
        if (this.#mediaStream) {
            this.#mediaStream.getTracks().forEach(track => track.stop());
            this.#mediaStream = null;
        }
        if (this.#animationFrameId) {
            this.#video.cancelVideoFrameCallback(this.#animationFrameId);
        }
        this.#video.srcObject = null
    }

    render() {
        if (this.innerHTML === '') {
            this.innerHTML = `
                <dialog>
                    <video class="display-flex width-80vw height-80vh" autoplay playsinline></video>
                    <canvas id="videoCanvas" class="display-none"></canvas>
                    <canvas id="opencvCanvas" class="display-flex width-80vw height-80vh"></canvas>
                </dialog>
            `
        }
    }
}

customElements.define('resonatorecho-detect', ResonatorEchoDetect)