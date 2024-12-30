import React, { useState, useEffect } from 'react'
import InstanceTable from '../Comp/InstanceTable';
import Loader from '../Comp/Loader';
import fetchInstanceDetails from '../Context/InstanceProvider'
import ErrorTab from '../Comp/ErrorTab';

// const instances = [
//     {
//         instance_name: "Production Server",
//         instance_id: "i-1234567890abcdef0",
//         created_at: "2024-01-15T10:30:00",
//         price: 156.78,
//         additional_info: {
//             type: "t2.micro",
//             region: "us-east-1",
//             status: "running",
//             public_ip: "54.123.45.67",
//             private_ip: "172.31.45.67"
//         }
//     },
// ];
const Home = () => {
    const [instances, setInstances] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await fetchInstanceDetails();
                setInstances(data)
                setError(null)
            } catch (error) {
                console.log(error, typeof error)
                setError(error.message || 'An error occurred while fetching instances');
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    if (loading) return <Loader />
    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-center my-5">Instance Management</h1>
                <ErrorTab error={error} />
                <div className="mt-6">
                    <InstanceTable instances={instances} />
                </div>
            </div>
        </div>
    )
}

export default Home