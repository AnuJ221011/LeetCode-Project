import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(
          `/problem/submittedProblem/${problemId}`
        );
        setSubmissions(response.data);
        setError(null);
      } catch (error) {
        setError("Error fetching submissions history");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "badge-success";
      case "wrong":
        return "badge-error";
      case "error":
        return "badge-warning";
      case "pending":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return memory + " KB";
    return (memory / 1024).toFixed(2) + " MB";
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Submission History</h2>

      {submissions.length === 0 ? (
        <div className="text-gray-500 text-center">No submissions found</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Runtime</th>
                  <th>Memory</th>
                  <th>Test Cases</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={submission._id}>
                    <td>{index + 1}</td>
                    <td className="font-mono">{submission.language}</td>
                    <td>
                      <span
                        className={`badge ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {submission.status.charAt(0).toUpperCase() +
                          submission.status.slice(1)}
                      </span>
                    </td>
                    <td className="font-mono">{submission.runtime}</td>
                    <td className="font-mono">
                      {formatMemory(submission.memory)}
                    </td>
                    <td className="font-mono">
                      {submission.testCasesPassed}/{submission.totalTestCases}
                    </td>
                    <td>{formatTime(submission.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing {submissions.length} submissions
          </p>
        </>
      )}

      {/* Code View Modal */}
      {selectedSubmission && (
        <dialog open className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg mb-4">Submission Details</h3>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <span
                  className={`badge ${getStatusColor(
                    selectedSubmission.status
                  )}`}
                >
                  {selectedSubmission.status}
                </span>
                <span className="badge badge-outline">
                  Runtime: {selectedSubmission.runtime} s
                </span>
                <span className="badge badge-outline">
                  Memory: {formatMemory(selectedSubmission.memory)}
                </span>
                <span className="badge badge-outline">
                  Passed: {selectedSubmission.testCasesPassed}/
                  {selectedSubmission.totalTestCases}
                </span>
              </div>

              {selectedSubmission.errorMessage && (
                <div className="alert alert-error mt-2">
                  <div>
                    <span>{selectedSubmission.errorMessage}</span>
                  </div>
                </div>
              )}
            </div>

            <pre className="bg-gray-900 p-4 rounded text-gray-100 overflow-x-auto">
              <code>{selectedSubmission.code}</code>
            </pre>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default SubmissionHistory;
