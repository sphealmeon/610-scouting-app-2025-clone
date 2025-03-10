'use client';

import { useEffect, useState } from 'react';
import { SubmitMatch } from '../firebase/submitMatch';
import { Data } from '../interfaces';

interface FailedSubmission {
  team: number;
  match: number;
  matchData: Data;
  timestamp: string;
}

export default function History() {
  const [failedSubmissions, setFailedSubmissions] = useState<FailedSubmission[]>([]);

  useEffect(() => {
    // Load failed submissions from localStorage
    const stored = JSON.parse(localStorage.getItem('failedSubmissions') || '[]');
    setFailedSubmissions(stored);
  }, []);

  const handleResubmit = async (submission: FailedSubmission, index: number) => {
    try {
      await SubmitMatch({
        team: submission.team,
        match: submission.match,
        matchData: submission.matchData,
      });
      
      // Remove the successful submission from localStorage and state
      const updatedSubmissions = [...failedSubmissions];
      updatedSubmissions.splice(index, 1);
      localStorage.setItem('failedSubmissions', JSON.stringify(updatedSubmissions));
      setFailedSubmissions(updatedSubmissions);
    } catch (error) {
      console.error('Resubmission failed:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Failed Submissions History</h1>
      
      {failedSubmissions.length === 0 ? (
        <p className="text-gray-500">No failed submissions to display</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Team</th>
                <th className="border p-2">Match</th>
                <th className="border p-2">Timestamp</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {failedSubmissions.map((submission, index) => (
                <tr key={index} className="border-b">
                  <td className="border p-2">{submission.team}</td>
                  <td className="border p-2">{submission.match}</td>
                  <td className="border p-2">
                    {new Date(submission.timestamp).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleResubmit(submission, index)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Resubmit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
