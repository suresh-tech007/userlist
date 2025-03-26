import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { getAllusers, loaduser } from "../redux/action/userAction.js";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function UsersDashboard() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user: curuser, userDetails, loading } = useSelector(state => state.user);
  const { users: alluserss, loading: loading2 } = useSelector(state => state.alluser);


  useEffect(() => {
const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }else{
      navigate("/");
    }

    dispatch(getAllusers());

    
  }, []);

  useEffect(() => {
    if (userDetails !== null) {
      setSelectedUser(userDetails);
    }
    if (curuser) {
      setUser(curuser);
    }

    if (alluserss) {
      setUsers(alluserss);
    }
  }, [alluserss, curuser, userDetails]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const getUserDetails = async (userId) => {
    await dispatch(loaduser(userId));
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center w-full gap-4 m-3 p-3">
        <h2 className="text-2xl font-bold mb-4">Users Dashboard</h2>

        {user && (
          <div className="flex items-center space-x-3">
            {/* Logged-in User Profile Image */}
            <img
              src={
                user?.photoURL?.startsWith("https://lh3.googleusercontent.com/")
                  ? user?.photoURL
                  : user?.photoURL
                    ? `${BASE_URL}${user.photoURL}`
                    : "https://lh3.googleusercontent.com/a/ACg8ocIVYOev_xNN3nApt6lmvk9zVbTboU2MgYXnBFxDQehgo8N0tgk=s96-c" // 🛠 Default image agar dono nahi mile
              }
              alt="User"
              className="w-16 h-16 rounded-full"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = "https://lh3.googleusercontent.com/a/ACg8ocKdZz31tBmLSfiDPCSCEkYkYZQfeKYDRf0PqjUEcmW0BMB5mw=s96-c"; // Set default image if error
              }}
            />

            <h3>Login User: {user?.email}</h3>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 mr-3 text-white py-2 px-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Users Table */}
      {loading && <p>Loading...</p>}
      {!loading && (
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Avatar</th>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                {/* User Profile Image */}
                <td className="py-2 px-4">
                  <img
                    src={
                      user?.photoURL?.startsWith("https://lh3.googleusercontent.com/")
                        ? user?.photoURL
                        : user?.photoURL
                          ? `${BASE_URL}${user.photoURL}`
                          : "https://lh3.googleusercontent.com/a/ACg8ocIVYOev_xNN3nApt6lmvk9zVbTboU2MgYXnBFxDQehgo8N0tgk=s96-c" // 🛠 Default image agar dono nahi mile
                    }
                    alt="User"
                    className="w-16 h-16 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = "https://lh3.googleusercontent.com/a/ACg8ocKdZz31tBmLSfiDPCSCEkYkYZQfeKYDRf0PqjUEcmW0BMB5mw=s96-c"; // Set default image if error
                    }}
                  />

                </td>
                <td className="py-2 px-4">{user._id}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td>
                  <button
                    onClick={() => getUserDetails(user._id)}
                    className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                  >
                    Check
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">User Details</h3>
            <img
              src={
                selectedUser?.photoURL?.startsWith("https://lh3.googleusercontent.com/")
                  ? selectedUser?.photoURL
                  : selectedUser?.photoURL
                    ? `${BASE_URL}${selectedUser.photoURL}`
                    : "https://lh3.googleusercontent.com/a/ACg8ocIVYOev_xNN3nApt6lmvk9zVbTboU2MgYXnBFxDQehgo8N0tgk=s96-c" // 🛠 Default image agar dono nahi mile
              }
              alt="User"
              className="w-16 h-16 rounded-full"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = "https://lh3.googleusercontent.com/a/ACg8ocKdZz31tBmLSfiDPCSCEkYkYZQfeKYDRf0PqjUEcmW0BMB5mw=s96-c"; // Set default image if error
              }}
            />
            <p><strong>ID:</strong> {selectedUser._id}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
