import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

const AdminDelete = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get("/problem/getAllProblem");
            setProblems(data);
        } catch (error) {
            setError("Error fetching problems");
        }
        finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure you want to delete this problem?")) return;
        try {
            await axiosClient.delete(`/problem/delete/${id}`);
            setProblems(problems.filter((problem) => problem.id !== id));
        } catch (error) {
            setError("Error deleting problem");
        }
    };

    if(loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    if(error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>{error}</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Delete Problem</h1>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th className="w-1/12">#</th>
                            <th className="w-4/12">Title</th>
                            <th className="w-2/12">Difficulty</th>
                            <th className="w-3/12">Tags</th>
                            <th className="w-2/12">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {problems.map((problem, index) => (
                            <tr key={problem._id}>
                                <td>{index + 1}</td>
                                <td>{problem.title}</td>
                                <td>
                                    <span className={`badge ${problem.difficulty === 'Easy' ? 'badge-success' : problem.difficulty === 'Medium' ? 'badge-warning' : 'badge-error'}`}>
                                        {problem.difficulty}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-outline">
                                        {problem.tags}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex space-x-2">
                                        <button className="btn btn-sm btn-error" onClick={() => handleDelete(problem._id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminDelete;