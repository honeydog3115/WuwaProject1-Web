import { httpClient } from "./apiClient.js";

export const getResonators = async ()=>{return await httpClient.get("/resonator/1")}
export const getResonatorDetail = async (id) => {return await httpClient.get(`/resonator/${id}`)}