import { httpClient } from "./apiClient.js";

export const getSubStatInfos = async () =>{return await httpClient.get("/substat")}