const axios = require('axios');
class CodeforcesAPI{
    constructor(){
        this.baseURL = 'https://codeforces.com/api';
    }
    async getUserInfo(handle){
        try{
            const response = await axios.get(`${this.baseURL}/user.info`,{
                params: { 
                    handles:handle
                }
            });
            return response.data.result[0];
        }
        catch(error){
            throw new Error(`Failed to fetch user info for ${handle} :${error.message}`);
        }

    }
    async getUserRating(handle){
        try{
            const response = await axios.get(`${this.baseURL}/user.raating`,{
                params:{
                    handle
                }
            });
            return response.data.result;
        }catch(error){
            throw new Error(`Failed to fetch user rating for ${handle} :${error.message}`);
        }
    }
    async getUserSubmissions(handle,count=1000){
        try{
            const response = await axios.get(`${this.baseURL}/user.status`,{
                params:{
                    handle,
                    count
                }
            });
            return response.data.result;
        }
        catch(error){
            throw new Error(`Failed to fetch user submissions for ${handle} :${error.message}`);
        }
    }
    async getContestStandings(contestId,handle){
        try{
            const response = await axios.get(`${this.baseURL}/contest.standings`,{
                params:{
                    contestId,
                    handles:handle,
                    showUnofficial:true
                }
            });
            return response.data.result;
        }
        catch(error){
            throw new Error(`Failed to fetch contest standings for contestId ${contestId} and handle ${handle} :${error.message}`);
        }
    }
}
module.exports = new CodeforcesAPI();