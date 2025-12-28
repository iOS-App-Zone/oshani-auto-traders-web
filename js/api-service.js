/**
 * Oshani Auto Traders API Service
 * Handles all API calls to fetch vehicle data
 */

const API_BASE_URL = 'https://oshani-traders-api.danusha-99h.workers.dev';
const API_KEY = 'oshani_api_key_001';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.apiKey = API_KEY;
    }

    /**
     * Get headers for API requests
     */
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey
        };
    }

    /**
     * Generic GET request
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    }

    /**
     * Generic POST request
     */
    async post(endpoint, body) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    }

    /**
     * Get vehicles by category
     * @param {string} category - 'preOrder', 'preOwn', or 'unregistered'
     */
    async getVehiclesByCategory(category) {
        try {
            const response = await this.get(`/api/vehicles?category=${category}`);
            
            // Handle different response formats
            let vehicles = [];
            if (response.data && Array.isArray(response.data)) {
                vehicles = response.data;
            } else if (response.vehicles && Array.isArray(response.vehicles)) {
                vehicles = response.vehicles;
            } else if (Array.isArray(response)) {
                vehicles = response;
            }

            return vehicles;
        } catch (error) {
            console.error(`Error fetching ${category} vehicles:`, error);
            return [];
        }
    }

    /**
     * Get all vehicles
     */
    async getAllVehicles() {
        try {
            const response = await this.get('/api/vehicles');
            
            let vehicles = [];
            if (response.data && Array.isArray(response.data)) {
                vehicles = response.data;
            } else if (response.vehicles && Array.isArray(response.vehicles)) {
                vehicles = response.vehicles;
            } else if (Array.isArray(response)) {
                vehicles = response;
            }

            return vehicles;
        } catch (error) {
            console.error('Error fetching all vehicles:', error);
            return [];
        }
    }

    /**
     * Get vehicle by ID
     */
    async getVehicleById(id) {
        try {
            const response = await this.get(`/api/vehicles/${id}`);
            return response.data || response.vehicle || response;
        } catch (error) {
            console.error(`Error fetching vehicle ${id}:`, error);
            return null;
        }
    }

    /**
     * Get statistics
     */
    async getStats() {
        try {
            const response = await this.get('/api/stats');
            return response.data || response;
        } catch (error) {
            console.error('Error fetching stats:', error);
            return null;
        }
    }

    /**
     * Get notices
     */
    async getNotices() {
        try {
            const response = await this.get('/api/notices');
            let notices = [];
            if (response.data && Array.isArray(response.data)) {
                notices = response.data;
            } else if (response.notices && Array.isArray(response.notices)) {
                notices = response.notices;
            } else if (Array.isArray(response)) {
                notices = response;
            }
            return notices;
        } catch (error) {
            console.error('Error fetching notices:', error);
            return [];
        }
    }

    /**
     * Get news
     */
    async getNews() {
        try {
            const response = await this.get('/api/news');
            let news = [];
            if (response.data && Array.isArray(response.data)) {
                news = response.data;
            } else if (response.news && Array.isArray(response.news)) {
                news = response.news;
            } else if (Array.isArray(response)) {
                news = response;
            }
            return news;
        } catch (error) {
            console.error('Error fetching news:', error);
            return [];
        }
    }
}

// Create global instance
const apiService = new ApiService();

