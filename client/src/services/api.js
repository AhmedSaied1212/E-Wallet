const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const parseJson = async (response) => {
    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();
    const trimmed = text.trim();

    if (!trimmed) {
        return null;
    }

    if (!contentType.includes("application/json") && (trimmed.startsWith("<!doctype") || trimmed.startsWith("<html"))) {
        throw new Error("The API returned HTML instead of JSON. Check that the backend server is running at " + BASE_URL + ".");
    }

    try {
        return JSON.parse(trimmed);
    } catch (error) {
        throw new Error("Invalid JSON response from the API. Check that the backend server is running at " + BASE_URL + ".");
    }
};

const api = {
    get: (request) => {
        return fetch(`${BASE_URL}/${request}`, {
            credentials: "include"
        });
    },

    post: (request, credentials) => {
        return fetch(`${BASE_URL}/${request}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(credentials),
        });
    },

    patch: (request, credentials) => {
        return fetch(`${BASE_URL}/${request}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(credentials),
        });
    },

    put: (request, id, credentials) => {
        return fetch(`${BASE_URL}/${request}/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(credentials),
        });
    },

    delete: (request, id) => {
        return fetch(`${BASE_URL}/${request}/${id}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
        });
    },

    parseJson,
};

export default api;