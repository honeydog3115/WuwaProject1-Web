import { httpClient } from "./apiClient";

export const getAttributes = async () => {return await httpClient.get("/attribute")}