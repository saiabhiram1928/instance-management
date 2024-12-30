

const fetchInstanceDetails = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-instances`, {
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