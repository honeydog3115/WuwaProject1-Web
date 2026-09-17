import { httpClient } from "./apiClient"

export const getWeapons = async () => {return await httpClient.get("/weapon")}