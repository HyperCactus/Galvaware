import axios from 'axios';

const QUOTE_API_BASE_URL = '/api/quotes/';
const JOB_API_BASE_URL = '/api/jobs/';

interface Quote {
  id?: string;
  title: string;
  content: string; // Assuming content is part of Quote
}

interface Job {
  id?: number;
  quote: number;
  order_channel: string;
  validation_status: string;
  inspection_notes?: string;
  inspection_images?: string | File | null;
  estimated_weight?: number;
  service_type: string;
  weight?: number;
  classification?: string;
  metadata?: object;
  schedule_date?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const getQuotes = async (params: { [key: string]: string } = {}): Promise<Quote[]> => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${QUOTE_API_BASE_URL}?${queryString}` : QUOTE_API_BASE_URL;
    
    const response = await axios.get(url);
    console.log('API Response Data:', response.data);
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results as Quote[];
    } else {
      console.error('API response results is not an array:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
}

export const createQuote = async (quoteData: Quote) => {
  try {
    const response = await axios.post(QUOTE_API_BASE_URL, quoteData);
    return response.data;
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
};

export const updateQuote = async (id: string, quoteData: Quote) => {
  try {
    const response = await axios.put(`${QUOTE_API_BASE_URL}${id}/`, quoteData);
    return response.data;
  } catch (error) {
    console.error('Error updating quote:', error);
    throw error;
  }
};

export const getJobs = async (): Promise<Job[]> => {
  try {
    const response = await axios.get(JOB_API_BASE_URL);
    return response.data.results as Job[];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const getJobById = async (id: number): Promise<Job> => {
  try {
    const response = await axios.get(`${JOB_API_BASE_URL}${id}/`);
    return response.data as Job;
  } catch (error) {
    console.error(`Error fetching job with ID ${id}:`, error);
    throw error;
  }
};

export const createJob = async (jobData: FormData) => {
  try {
    const response = await axios.post(JOB_API_BASE_URL, jobData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (id: number, jobData: FormData) => {
  try {
    const response = await axios.put(`${JOB_API_BASE_URL}${id}/`, jobData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating job with ID ${id}:`, error);
    throw error;
  }
};

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post('/api/login/', { username, password });
    return response.data; // This should contain token, user_id, username, email
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/register/', { username, email, password });
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const logout = async (token: string) => {
  try {
    await axios.post('/api/auth/logout/', {}, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};