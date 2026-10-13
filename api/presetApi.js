import { httpClient } from "./apiClient"

export const savePreset = async (headers, body) => { await httpClient.post("/preset/save", body, headers) }
export const getSimplePresetInfos = async (userId) => { await httpClient.get(`/preset/simplepresetinfo/${userId}`) }
export const getPreset = async (presetId) => { await httpClient.get(`/preset/${presetId}`) }