const axios = require('axios');

class CodeforcesAPI {
    constructor() {
        this.baseURL = 'https://codeforces.com/api';
        this.rateLimitDelay = 1000; // 1 second delay between requests
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async makeRequest(endpoint, params = {}) {
        try {
            console.log(`Making request to ${endpoint} with params:`, params);
            const response = await axios.get(`${this.baseURL}/${endpoint}`, { params });
            
            if (response.data.status === 'FAILED') {
                throw new Error(response.data.comment || 'API request failed');
            }
            
            return response.data.result;
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error.message);
            
            // Handle 403 Forbidden specifically
            if (error.response && error.response.status === 403) {
                throw new Error('Codeforces is temporarily blocking requests. Please try again later.');
            }
            
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            throw new Error(`Codeforces API error: ${error.message}`);
        }
    }

    async getUserInfo(handle) {
        try {
            console.log(`Fetching user info for handle: ${handle}`);
            const result = await this.makeRequest('user.info', { handles: handle });
            
            if (!result || result.length === 0) {
                throw new Error(`No user found with handle: ${handle}`);
            }
            
            console.log(`Successfully fetched user info for ${handle}`);
            return result[0];
        } catch (error) {
            console.error(`Error fetching user info for ${handle}:`, error.message);
            throw error;
        }
    }

    async getUserRating(handle) {
        try {
            console.log(`Fetching user rating for handle: ${handle}`);
            const result = await this.makeRequest('user.rating', { handle });
            
            if (!result) {
                throw new Error(`No rating data found for handle: ${handle}`);
            }
            
            console.log(`Successfully fetched rating data for ${handle}`);
            return result;
        } catch (error) {
            console.error(`Error fetching user rating for ${handle}:`, error.message);
            throw error;
        }
    }

    async getUserSubmissions(handle, count = 1000) {
        try {
            console.log(`Fetching user submissions for handle: ${handle}`);
            const result = await this.makeRequest('user.status', { handle, count });
            
            if (!result) {
                throw new Error(`No submission data found for handle: ${handle}`);
            }
            
            console.log(`Successfully fetched ${result.length} submissions for ${handle}`);
            return result;
        } catch (error) {
            console.error(`Error fetching user submissions for ${handle}:`, error.message);
            throw error;
        }
    }

    async getContestStandings(contestId, handle) {
        try {
            console.log(`Fetching contest standings for contest ${contestId} and handle: ${handle}`);
            const result = await this.makeRequest('contest.standings', {
                contestId,
                handles: handle,
                showUnofficial: true
            });
            
            if (!result) {
                throw new Error(`No standings data found for contest ${contestId} and handle: ${handle}`);
            }
            
            console.log(`Successfully fetched contest standings for ${handle}`);
            return result;
        } catch (error) {
            console.error(`Error fetching contest standings for ${handle}:`, error.message);
            throw error;
        }
    }
}

module.exports = new CodeforcesAPI(); 