import { httpClient } from "./apiClient"

export const calcScore = async (body, headers) => { return await httpClient.post('/resonatorecho', body, headers) }