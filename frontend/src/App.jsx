import { Routes, Route, Navigate } from "react-router"
import Homepage from "./pages/Homepage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import {checkAuth} from "./authSlice"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import AdminPanel from "./pages/AdminPanel"
import ProblemPage from "./pages/ProblemPage"

function App() {

  // code for authentication will be here (isAuthenticated)
  const {isAuthenticated, user, loading} = useSelector((state) => state.auth); // getting isAuthenticated from redux store named auth
  const dispatch = useDispatch();

  // to check if user is authenticated or not when app loads
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if(loading) {
    return(
       <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  console.log("user:", user);
  console.log("isAuthenticated:", isAuthenticated);

  return (
    <>
      <Routes>
        <Route path='/' element={isAuthenticated ? <Homepage/> : <Navigate to="/signup" />} />
        <Route path='/login' element={isAuthenticated ? <Navigate to="/" /> : <Login/>} />
        <Route path='/signup' element={isAuthenticated ? <Navigate to="/" /> : <Signup/>} />

        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin"
              ? <AdminPanel />
              : <Navigate to="/" />
          }
        />

        {/* <Route path="/admin" element={<AdminPanel />} /> */}
        <Route path="/problem/:problemId" element={<ProblemPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  )
}

export default App
