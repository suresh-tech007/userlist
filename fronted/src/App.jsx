import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Registertion from "./components/Registertion";
import UsersDashboard from "./components/UsersDashboard";
 

function App() {
  return (
    <div className=" ">
      
      <Routes>

        <Route path="/" element={<Login />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/dashboard" element={<UsersDashboard />} />
        {/* <Route path="*" element={<NotFound />} />  */}
      </Routes>
    </div>
  );
}

export default App;
