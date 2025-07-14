import React, { useEffect, useState } from 'react';
import { getJobs } from '../../services/api';
import { Link } from 'react-router-dom';

interface Job {
  id?: number;
  quote: number;
  order_channel: string;
  validation_status: string;
  service_type: string;
  status: string;
  created_at?: string;
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        setError('Failed to fetch jobs.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job List</h1>
      <div className="mb-4">
        <Link to="/jobs/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create New Job
        </Link>
      </div>
      {jobs.length === 0 ? (
        <p>No jobs found. Create a new job to get started.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Quote ID</th>
                <th className="py-2 px-4 border-b">Order Channel</th>
                <th className="py-2 px-4 border-b">Validation Status</th>
                <th className="py-2 px-4 border-b">Service Type</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Created At</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td className="py-2 px-4 border-b">{job.id}</td>
                  <td className="py-2 px-4 border-b">{job.quote}</td>
                  <td className="py-2 px-4 border-b">{job.order_channel}</td>
                  <td className="py-2 px-4 border-b">{job.validation_status}</td>
                  <td className="py-2 px-4 border-b">{job.service_type}</td>
                  <td className="py-2 px-4 border-b">{job.status}</td>
                  <td className="py-2 px-4 border-b">{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    <Link to={`/jobs/${job.id}`} className="text-blue-600 hover:text-blue-900 mr-2">
                      Edit
                    </Link>
                    {/* Add delete functionality later if needed */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobList;