import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Processed Dips Today</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Total Quotes</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Pending Approvals</h2>
          <p className="text-4xl font-bold text-yellow-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Active Users</h2>
          <p className="text-4xl font-bold text-purple-600 mt-2">0</p>
        </div>
      </div>

      {/* Live Job Tracker */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Live Job Tracker</h2>
        <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-500">
          Placeholder for Live Job Tracker
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity Feed</h2>
        <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-500">
          Placeholder for Recent Activity Feed
        </div>
      </div>
    </div>
  );
};

export default Dashboard;