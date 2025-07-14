// Placeholder content for QuoteList component
import React, { useState, useEffect } from 'react';
import { getQuotes } from '../../services/api';

interface Quote {
  id?: string;
  title: string;
}

const QuoteList: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
      const fetchQuotes = async () => {
          try {
              setLoading(true);
              const data: Quote[] = await getQuotes();
              setQuotes(data);
          } catch (err: any) {
              setError(err);
          } finally {
              setLoading(false);
          }
      };
  
      fetchQuotes();
  }, []);
  
  const handleApplyFilters = async () => {
      try {
          setLoading(true);
          const data: Quote[] = await getQuotes({
              status: statusFilter.toLowerCase(),
              search: searchTerm
          });
          setQuotes(data);
      } catch (err: any) {
          setError(err);
      } finally {
          setLoading(false);
      }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading quotes: {error.message}</div>;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quotes</h1>
        <div className="flex space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled
          >
            Bulk Actions
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled
          >
            New Quote
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by quote #, client name..."
          className="px-3 py-2 border rounded flex-grow min-w-[200px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="px-3 py-2 border rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Draft</option>
          <option>Pending Approval</option>
          <option>Approved</option>
          <option>Expired</option>
        </select>
        
        <input
          type="text"
          placeholder="Client"
          className="px-3 py-2 border rounded"
          disabled
        />
        
        <input
          type="date"
          className="px-3 py-2 border rounded"
          disabled
        />
        
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
        
        <button
          className="px-4 py-2 text-blue-500 hover:text-blue-700"
          disabled
        >
          Clear All
        </button>
      </div>

      {/* Quotes Table */}
      <ul className="bg-white shadow rounded-lg divide-y">
        {quotes && quotes.length === 0 ? (
          <li className="p-4 text-gray-500">No quotes found. Please create one.</li>
        ) : (
          quotes && quotes.map((quote) => (
            <li
              key={quote.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
            >
              {quote.title}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default QuoteList;