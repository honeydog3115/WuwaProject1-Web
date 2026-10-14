import { httpClient } from "./apiClient"

export const savePreset = async (headers, body) => { await httpClient.post("/preset/save", body, headers) }
export const getSimplePresetsInfo = async (userId) => { return await httpClient.get(`/preset/simplepresetsinfo/${userId}`) }
export const getPreset = async (presetId) => { return await httpClient.get(`/preset/${presetId}`) }