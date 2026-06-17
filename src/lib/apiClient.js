// apiClient.js — replaces the PocketBase SDK with direct Express API calls.

const API_BASE = '/api';

const apiClient = {
  /**
   * Make an authenticated request to the Express API.
   */
  async request(endpoint, options = {}) {
    let token = localStorage.getItem('authToken');
    
    if (!token) {
      const docAuth = localStorage.getItem('doctorAuth');
      if (docAuth) {
        try { token = JSON.parse(docAuth).token; } catch(e) {}
      }
    }
    
    if (!token) {
      const adminAuth = localStorage.getItem('adminAuth');
      if (adminAuth) {
        try { token = JSON.parse(adminAuth).token; } catch(e) {}
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }

    return data;
  },

  // ── Auth helpers ─────────────────────────────────────────────────────────

  async doctorLogin(email, password) {
    const data = await this.request('/auth/doctor/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('doctorAuth', JSON.stringify(data));
    return data;
  },

  async adminLogin(email, password) {
    const data = await this.request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('adminAuth', JSON.stringify(data));
    return data;
  },

  async patientLogin(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('authToken', data.token);
    return data;
  },

  async patientRegister(email, password, full_name, phone) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name, phone }),
    });
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  async oneTapAuth(email, full_name, phone = '') {
    const data = await this.request('/auth/one-tap', {
      method: 'POST',
      body: JSON.stringify({ email, full_name, phone }),
    });
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  async verifyEmail(token) {
    return await this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  async payDoctorRegistrationFee(plan = 'basic') {
    return await this.request('/doctors/pay-registration-fee', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  },

  async updateUser(id, data) {
    return await this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getDoctor(id) {
    return await this.request(`/doctors/${id}`);
  },

  async getMessages(roomId) {
    return await this.request(`/messages/${roomId}`);
  },

  async sendMessage(roomId, payload) {
    return await this.request(`/messages/${roomId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout(storageKey = 'authToken') {
    localStorage.removeItem(storageKey);
    localStorage.removeItem('doctorAuth');
    localStorage.removeItem('adminAuth');
  },
};

export default apiClient;
