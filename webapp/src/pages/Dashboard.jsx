import React from 'react';

const StatCard = ({ title, value, change, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      {icon}
    </div>
    {change && (
      <p className={`mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
      </p>
    )}
  </div>
);

const RecentActivity = () => (
  <div className="bg-white rounded-lg shadow-sm">
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      <div className="mt-6 space-y-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Activity {i + 1}</p>
              <p className="text-sm text-gray-500">Description of activity {i + 1}</p>
            </div>
            <span className="text-sm text-gray-500">2h ago</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Chart = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-lg font-medium text-gray-900">Overview</h3>
    <div className="mt-6 h-64 bg-gray-50 rounded flex items-center justify-center">
      <p className="text-gray-500">Chart placeholder</p>
    </div>
  </div>
);

const Dashboard = () => {
  // Example data
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: 12,
      icon: (
        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      ),
    },
    {
      title: 'Active Projects',
      value: '23',
      change: -2.3,
      icon: (
        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      ),
    },
    {
      title: 'Tasks Completed',
      value: '567',
      change: 8.1,
      icon: (
        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M15 11v3m0 0v3m0-3h3m-3 0h-3" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Chart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;