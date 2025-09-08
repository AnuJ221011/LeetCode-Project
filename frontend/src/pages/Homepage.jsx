import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tags: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 20;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) {
      fetchSolvedProblems();
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  // 🔹 Filtering logic
  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;

    const tagMatch =
      filters.tags === "all" || problem.tags.includes(filters.tags);

    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" &&
        solvedProblems.some((sp) => sp._id === problem._id)) ||
      (filters.status === "unsolved" &&
        !solvedProblems.some((sp) => sp._id === problem._id));

    return difficultyMatch && tagMatch && statusMatch;
  });

  // 🔹 Pagination logic
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
  const startIndex = (currentPage - 1) * problemsPerPage;
  const currentProblems = filteredProblems.slice(
    startIndex,
    startIndex + problemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* 🔹 Navigation Bar */}
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl">
            Leetcode
          </NavLink>
        </div>
        <div className="flex-none gap-4">
          {user && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                {user?.firstName}
              </div>
              <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* 🔹 Main Content */}
      <div className="container mx-auto p-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Status Filter */}
          <select
            className="select select-bordered"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
            <option value="unsolved">Unsolved Problems</option>
          </select>

          {/* Difficulty Filter */}
          <select
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({ ...filters, difficulty: e.target.value })
            }
          >
            <option value="all">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Tags Filter */}
          <select
            className="select select-bordered"
            value={filters.tags}
            onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="string">String</option>
            <option value="math">Math</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="grid gap-4">
          {currentProblems.map((problem) => (
            <div key={problem._id} className="card bg-base-100 shadow-md">
              <div className="card-body p-4 py-3">
                <div className="flex justify-between items-center">
                  <h2 className="card-title text-lg">
                    <Link
                      to={`/problem/${problem._id}`}
                      className="hover:text-blue-500"
                    >
                      {problem.title}
                    </Link>
                  </h2>
                  {solvedProblems.some((sp) => sp._id === problem._id) && (
                    <div className="badge badge-success gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>{" "}
                      Solved
                    </div>
                  )}
                </div>

                {/* Difficulty + Tags */}
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2 flex-wrap">
                    <div
                      className={`badge ${
                        problem.difficulty === "easy"
                          ? "badge-success"
                          : problem.difficulty === "medium"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {problem.difficulty}
                    </div>

                    {problem.tags?.map((tag, idx) => (
                      <div key={idx} className="badge badge-outline">
                        {tag}
                      </div>
                    ))}
                  </div>

                  {/* Solve Button */}
                  <button
                    className="btn btn-primary btn-xs"
                    onClick={() => navigate(`/problem/${problem._id}`)}
                  >
                    Solve Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProblems.length === 0 && (
            <p className="text-center text-gray-500">
              No problems found with selected filters.
            </p>
          )}
        </div>

        {/* 🔹 Pagination Controls */}
        {filteredProblems.length > problemsPerPage && (
          <div className="flex justify-center items-center mt-6 gap-2">
            <button
              className="btn btn-sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${
                  currentPage === i + 1 ? "btn-active" : ""
                }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
