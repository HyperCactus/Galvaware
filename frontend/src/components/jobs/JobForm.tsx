import React, { useState, useEffect } from 'react';
import { createJob, getJobById, updateJob, getQuotes } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

interface JobFormProps {
  isEditMode?: boolean;
}

interface Quote {
  id?: string;
  title: string;
}

const JobForm: React.FC<JobFormProps> = ({ isEditMode = false }) => {
  const [jobData, setJobData] = useState<{
    quote: string;
    order_channel: string;
    validation_status: string;
    inspection_notes?: string;
    inspection_images?: string | File | null;
    estimated_weight?: string;
    service_type: string;
    weight?: string;
    classification?: string;
    metadata?: object;
    schedule_date?: string;
    status: string;
  }>({
    quote: '',
    order_channel: 'manual',
    validation_status: 'pending',
    inspection_notes: undefined,
    inspection_images: null,
    estimated_weight: undefined,
    service_type: 'galvanizing',
    weight: undefined,
    classification: undefined,
    metadata: {},
    schedule_date: undefined,
    status: 'pending',
  });
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const fetchedQuotes = await getQuotes();
        setQuotes(fetchedQuotes.map(quote => ({ id: quote.id, title: quote.title })));
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };

    fetchQuotes();

    if (isEditMode && id) {
      const jobId = parseInt(id);
      getJobById(jobId)
        .then(data => {
          setJobData({
            ...data,
            quote: data.quote.toString(), // Convert quote ID to string for select input
            estimated_weight: data.estimated_weight?.toString(),
            weight: data.weight?.toString(),
            schedule_date: data.schedule_date ? new Date(data.schedule_date).toISOString().slice(0, 16) : undefined,
            inspection_images: data.inspection_images || null, // Handle existing image URL
          });
        })
        .catch(error => console.error('Error fetching job:', error));
    }
  }, [isEditMode, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setJobData(prevData => ({
        ...prevData,
        [name]: fileInput.files ? fileInput.files[0] : null,
      }));
    } else {
      setJobData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // Append all jobData fields to formData
      for (const key in jobData) {
        if (jobData.hasOwnProperty(key)) {
          const value = (jobData as any)[key];
          if (value !== undefined && value !== null) {
            if (key === 'quote') {
              formData.append(key, String(parseInt(value)));
            } else if (key === 'estimated_weight' || key === 'weight') {
              formData.append(key, String(parseFloat(value)));
            } else if (key === 'metadata') {
              formData.append(key, JSON.stringify(value));
            } else if (key === 'inspection_images' && value instanceof File) {
              formData.append(key, value);
            } else if (key === 'schedule_date' && value) {
              formData.append(key, value);
            } else if (key !== 'inspection_images' || !(value instanceof File)) {
              formData.append(key, value);
            }
          }
        }
      }

      if (isEditMode && id) {
        await updateJob(parseInt(id), formData);
      } else {
        await createJob(formData);
      }
      navigate('/jobs');
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Job' : 'Create New Job'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="quote" className="block text-sm font-medium text-gray-700">Quote</label>
          <select
            id="quote"
            name="quote"
            value={jobData.quote}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a Quote</option>
            {quotes.map(quote => (
              <option key={quote.id} value={quote.id}>
                {quote.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="order_channel" className="block text-sm font-medium text-gray-700">Order Channel</label>
          <select
            id="order_channel"
            name="order_channel"
            value={jobData.order_channel}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="manual">Manual</option>
            <option value="client_portal">Client Portal</option>
            <option value="depot_kiosk">Depot Kiosk</option>
          </select>
        </div>

        <div>
          <label htmlFor="validation_status" className="block text-sm font-medium text-gray-700">Validation Status</label>
          <select
            id="validation_status"
            name="validation_status"
            value={jobData.validation_status}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="pending">Pending</option>
            <option value="validated">Validated</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div>
          <label htmlFor="inspection_notes" className="block text-sm font-medium text-gray-700">Inspection Notes</label>
          <textarea
            id="inspection_notes"
            name="inspection_notes"
            value={jobData.inspection_notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label htmlFor="inspection_images" className="block text-sm font-medium text-gray-700">Inspection Images</label>
          <input
            type="file"
            id="inspection_images"
            name="inspection_images"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {jobData.inspection_images && typeof jobData.inspection_images === 'string' && (
            <p className="mt-2 text-sm text-gray-500">Current image: <a href={jobData.inspection_images} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">View</a></p>
          )}
        </div>

        <div>
          <label htmlFor="estimated_weight" className="block text-sm font-medium text-gray-700">Estimated Weight</label>
          <input
            type="number"
            id="estimated_weight"
            name="estimated_weight"
            value={jobData.estimated_weight}
            onChange={handleChange}
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="service_type" className="block text-sm font-medium text-gray-700">Service Type</label>
          <select
            id="service_type"
            name="service_type"
            value={jobData.service_type}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="galvanizing">Galvanizing</option>
            <option value="powder_coating">Powder Coating</option>
            <option value="anodizing">Anodizing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Actual Weight</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={jobData.weight}
            onChange={handleChange}
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="classification" className="block text-sm font-medium text-gray-700">Classification</label>
          <input
            type="text"
            id="classification"
            name="classification"
            value={jobData.classification}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="schedule_date" className="block text-sm font-medium text-gray-700">Schedule Date</label>
          <input
            type="datetime-local"
            id="schedule_date"
            name="schedule_date"
            value={jobData.schedule_date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={jobData.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditMode ? 'Update Job' : 'Create Job'}
        </button>
      </form>
    </div>
  );
};

export default JobForm;