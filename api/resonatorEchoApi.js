import { httpClient } from "./apiClient"

export const calcScore = async (body) => { return await httpClient.post('/resonatorecho', body) }