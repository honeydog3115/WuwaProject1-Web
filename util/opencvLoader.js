let cvPromise = null;

export const loadOpenCV = (src = 'https://docs.opencv.org/4.13.0/opencv.js') => {
    if (cvPromise) return cvPromise;

    cvPromise = new Promise((resolve, reject) => {
        // 1. 이미 Mat이 사용 가능한 상태면 즉시 반환
        if (window.cv?.Mat) {
            return resolve(window.cv);
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.type = 'text/javascript';

        script.onload = () => {
            const cv = window.cv;

            if (!cv) {
                return reject(new Error('window.cv 객체를 찾을 수 없습니다.'));
            }

            // cv.then이 있는 경우 (Thenable)
            // resolve(cv) 대신 then 콜백 안에서 cv.then을 정리하거나 인스턴스를 전달합니다.
            // 빌드 방식에 따른 조건 분기. if 가 가장 최신의 빌드 방식
            if (typeof cv.then === 'function') {
                cv.then((instance) => {
                    // Promise 무한 루프 방지를 위해 then 메서드 참조를 끊어줍니다.
                    delete instance.then;
                    resolve(instance);
                });
            } else if (cv.Mat) {
                resolve(cv);
            } else {
                cv.onRuntimeInitialized = () => {
                    delete cv.then;
                    resolve(cv);
                };
            }
        };

        script.onerror = () => {
            cvPromise = null;
            reject(new Error('OpenCV.js 로딩 실패'));
        };

        document.body.appendChild(script);
    });

    return cvPromise;
};