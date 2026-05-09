export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
            Authorization: `Bearer ${token}`,
        }
    })

    if (res.status === 401) {
        throw new Error("Unauthorized")
    }

    return res.json() as Promise<T>
}