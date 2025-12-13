import React from 'react';

const getLastNDates = (n) => {
  const arr = [];
  const today = new Date();
  for (let i = n-1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    arr.push(d);
  }
  return arr;
};

const ActivityStreak = ({ days }) => {
  // days: array of 'YYYY-MM-DD' strings
  const activeSet = new Set(days || []);
  const dates = getLastNDates(28);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Activity Streak (Last 4 Weeks)</h3>
      <div className="flex space-x-1">
        {dates.map((date, i) => {
          const str = date.toISOString().slice(0, 10);
          const isActive = activeSet.has(str);
          return (
            <div key={str} title={str}
              className={`w-6 h-6 rounded-md border ${isActive ? 'bg-blue-500 border-blue-500' : 'bg-gray-200 border-gray-300'}`}/>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-400">
        <span>{dates[0].toLocaleDateString()}</span>
        <span>{dates[dates.length - 1].toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default ActivityStreak;
