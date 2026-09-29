import { httpClient } from "./apiClient"

export const getEchos = async () => { return await httpClient.get("/echo") }