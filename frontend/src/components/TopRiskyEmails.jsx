import React from 'react';

const TopRiskyEmails = ({ emails, asPlain = false }) => {
  if (!emails?.length) return null;
  return (
    <div className={asPlain ? '' : "bg-white rounded-lg shadow p-6"}>
      {!asPlain && <h3 className="text-lg font-semibold mb-4">Top 5 Risky Emails</h3>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-600">
          <thead>
            <tr>
              <th className="p-2 font-medium text-left">Summary</th>
              <th className="p-2 font-medium text-left">Risk Level</th>
              <th className="p-2 font-medium text-left">Confidence</th>
              <th className="p-2 font-medium text-left">Analyzed At</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((item, idx) => (
              <tr key={item.id} className={idx%2 ? 'bg-gray-50' : ''}>
                <td className="p-2 truncate max-w-[320px]" title={item.summary}>{item.summary}</td>
                <td className="p-2 font-bold capitalize">{item.risk_level}</td>
                <td className="p-2">{(item.confidence * 100).toFixed(1)}%</td>
                <td className="p-2">{item.created_at ? new Date(item.created_at).toLocaleString(): ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopRiskyEmails;


