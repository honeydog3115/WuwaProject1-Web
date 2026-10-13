import { httpClient } from "./apiClient"

export const savePreset = async (headers, body) => { await httpClient.post("/preset/save", body, headers) }