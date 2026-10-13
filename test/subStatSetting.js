import { getEchos } from "../api/echoApi"

export const testSetting = async (element) => {
    const echo = await getEchos()

    const containers = element.querySelectorAll('[class^=resonatorecho-]')
    containers.forEach(async (container, index) => {
        const echoCard = container.querySelector('echo-card')
        if (index === 0 ) {
            echoCard.echo = echo[26].echos[0]
        }
        else if (index === 1) {
            echoCard.echo = echo[26].echos[1]
        }
        else if (index === 2) {
            echoCard.echo = echo[26].echos[2]
        }
        else if (index === 3) {
            echoCard.echo = echo[26].echos[5]
        }
        else if (index === 4) {
            echoCard.echo = echo[26].echos[6]
        }
        const subStatNames = container.querySelectorAll('substat-name')
        // 모든 substat-name 내부의 li가 13개가 될 때까지 각각 대기
        const promises = Array.from(subStatNames).map(subStatName => 
            waitForLiLoaded(subStatName, 13)
        );

        // 모든 컨텐츠가 로딩될 때까지 병렬로 대기
        await Promise.all(promises);
        
        subStatNames.forEach((subStatName, index) => {
            const content = subStatName.querySelectorAll('li')
            content[12-index].click()
        })
        const subStatValues = container.querySelectorAll('substat-value')
        subStatValues.forEach((subStatValue, index) => {
            const content = subStatValue.querySelectorAll('li')
            content[index].click()
        })
    })
}

function waitForLiLoaded(element, targetCount = 13) {
    return new Promise((resolve) => {
        // 이미 로딩이 완료되어 있는 경우 바로 통과
        if (element.querySelectorAll('li').length >= targetCount) {
            return resolve();
        }

        const observer = new MutationObserver((mutations, obs) => {
            if (element.querySelectorAll('li').length >= targetCount) {
                obs.disconnect(); // 감시 종료
                resolve();        // 대기 완료
            }
        });

        observer.observe(element, {
            childList: true, 
            subtree: true
        });
    });
}