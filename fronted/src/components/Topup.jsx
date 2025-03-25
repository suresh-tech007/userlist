import React from "react";

const TopUp = ({ user }) => {
  if (!user) {
    return <div className="text-center text-gray-500">User details not available</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">User Details</h2>
      <div className="flex flex-col gap-3">
        <div>
          <span className="font-medium">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-medium">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-medium">Balance:</span> ₹{user.balance}
        </div>
        <div className="text-center mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Top Up Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUp;