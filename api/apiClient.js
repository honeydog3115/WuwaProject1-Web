const BASE_URL = ""

async function request(endpoint, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options
    }
    try{
        const response = await fetch(`${BASE_URL}${endpoint}`, config)

        if(!response.ok){
            const errorData = await response.json().catch(()=>({}))
            throw new Error(errorData.message || `HTTP 오류: ${response.status}`)
        }

        if(response.status === 204) return null

        return await response.json()
    } catch(error){
        console.error("API 통신 에러:", error)
    }
}
export const httpClient = {
    get: (endpoint, headers) => request(endpoint, {method: "GET", headers}),
    post: (endpoint, body, headers) => 
        request(endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        }),
    put: (endpoint, body, headers) => 
        request(endpoint, {
            method: "PUT",
            headers,
            body: JSON.stringify(body),
        }),
    delete: (endpoint, headers) => request(endpoint, {method: "DELETE", headers})
}