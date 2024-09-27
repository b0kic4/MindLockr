export function Dashboard() {
  return (
    <div className="p-8 lg:ml-20">
      {" "}
      {/* Apply margin only on lg screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Indicator Widgets */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Indicators</h2>
          <div className="flex space-x-4 mt-4">
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-purple-600">80 bpm</p>
              <p className="text-sm text-gray-500">Heart rate</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">60-70 mg/dL</p>
              <p className="text-sm text-gray-500">Glucose</p>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Activity</h2>
          <div className="mt-4">
            <p className="text-3xl font-bold text-orange-600">12,354 Kcal</p>
            <p className="text-sm text-gray-500">This Month</p>
            {/* Add your chart component here */}
          </div>
        </div>

        {/* Calendar */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Calendar</h2>
          {/* Add a Calendar Component */}
          <div className="mt-4">
            <p className="text-lg text-gray-800">December 2022</p>
            <p className="text-sm text-gray-500">Upcoming Appointments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
