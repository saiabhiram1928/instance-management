

const fetchInstanceDetails = async (page, per_page) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-instances?page=${page}&per_page=${per_page}`, {
        method: "GET",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await res.json()
    if (!res.ok) {
        console.log(data)
        throw new Error(data.error || 'Failed to fetch instances');
    }
    return data;
}
export default fetchInstanceDetails