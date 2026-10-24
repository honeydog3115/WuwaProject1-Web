let cvPromise = null;

export function loadOpenCV(src = 'https://docs.opencv.org/4.13.0/opencv.js') {
    if (cvPromise) return cvPromise;           // 이미 로딩 중이거나 완료됐으면 재사용

    cvPromise = new Promise((resolve, reject) => {
        // 다른 곳에서 이미 로드해 둔 경우
        if (window.cv?.Mat) return resolve(window.cv);

        const script = document.createElement('script');
        script.src = src;
        script.async = true;

        script.onload = async () => {
            let cv = window.cv;

            // 빌드에 따라 cv가 Promise로 노출되는 경우가 있음 (4.x 일부 빌드)
            if (cv instanceof Promise) {
                cv = await cv;
            }

            if (cv.Mat) {
                resolve(cv);                          // 이미 초기화 완료
            } else {
                cv.onRuntimeInitialized = () => resolve(cv);   // WASM 초기화 대기
            }
        };

        script.onerror = () => {
            cvPromise = null;                       // 실패하면 재시도할 수 있게 초기화
            reject(new Error('OpenCV.js 로딩 실패'));
        };

        document.head.appendChild(script);        // shadow root가 아니라 document에 추가
    });

    return cvPromise;
}