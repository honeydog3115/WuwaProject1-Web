import { httpClient } from "./apiClient.js";

export const getResonators = async ()=>{return await httpClient.get("/resonator/1")}