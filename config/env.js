// 이렇게 환경변수 설정 js를 만들면 나중에 VITE가 아닌 다른 웹 빌더를 사용할 때 유지보수하기 쉬워짐
const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_BASE_URL
const RESONATOR = import.meta.env.VITE_RESONATOR_IMAGE_URL
const ATTRIBUTE = import.meta.env.VITE_ATTRIBUTE_IMAGE_URL
const WEAPON = import.meta.env.VITE_WEAPON_IMAGE_URL

export const RESONATOR_IMAGE_URL = `${BASE_IMAGE_URL}${RESONATOR}`
export const ATTRIBUTE_IMAGE_URL = `${BASE_IMAGE_URL}${ATTRIBUTE}`
export const WEAPON_IMAGE_URL = `${BASE_IMAGE_URL}${WEAPON}`
