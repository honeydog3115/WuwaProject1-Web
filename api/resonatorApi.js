import { httpClient } from "./apiClient";

export const getResonators = async ()=>{return await httpClient.get("/resonator")}