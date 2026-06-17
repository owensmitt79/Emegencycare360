// Backend API Client for EmergencyCare360
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async signup(data) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async verifyEmail(token) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me', { method: 'GET' });
  }

  async updateProfile(data) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Emergency endpoints
  async createEmergency(data) {
    return this.request('/emergencies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEmergencies() {
    return this.request('/emergencies', { method: 'GET' });
  }

  async getEmergency(id) {
    return this.request(`/emergencies/${id}`, { method: 'GET' });
  }

  async updateEmergencyStatus(id, data) {
    return this.request(`/emergencies/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelEmergency(id) {
    return this.request(`/emergencies/${id}`, { method: 'DELETE' });
  }

  // Doctor endpoints
  async registerDoctor(data) {
    return this.request('/doctors/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDoctors(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params ? `/doctors?${params}` : '/doctors';
    return this.request(endpoint, { method: 'GET' });
  }

  async getDoctor(id) {
    return this.request(`/doctors/${id}`, { method: 'GET' });
  }

  async updateDoctorProfile(data) {
    return this.request('/doctors/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateDoctorAvailability(availabilityStatus) {
    return this.request('/doctors/availability', {
      method: 'PUT',
      body: JSON.stringify({ availabilityStatus }),
    });
  }

  // Consultation endpoints
  async scheduleConsultation(data) {
    return this.request('/consultations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getConsultations() {
    return this.request('/consultations', { method: 'GET' });
  }

  async getConsultation(id) {
    return this.request(`/consultations/${id}`, { method: 'GET' });
  }

  async updateConsultationStatus(id, data) {
    return this.request(`/consultations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelConsultation(id) {
    return this.request(`/consultations/${id}`, { method: 'DELETE' });
  }
}

export default new ApiClient();
