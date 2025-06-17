import axios from 'axios';
const API_URL ='http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers:{
        'Content-Type':'application/json',
    },
});

export const studentAPI = {
    getAllStudents: async()=>{
        const response = await api.get('/students');
        return response.data;
    },
    createStudent: async(studentData)=>{
        const response = await api.post('/students',studentData);
        return response.data;
    },
    updateStudent: async (id,studentData)=>{
        const response = await api.put(`/students/${id}`,studentData);
        return response.data;
    },
    deleteStudent: async(id)=>{
        const response = await api.delete(`/students/${id}`);
        return response.data;
    },
    getStudentProfile : async(id)=>{
        const response = await api.get(`/studentss/${id}/profile`);
        return response.data;
    },
    downloadCSV: async()=>{
        const response = await api.get(`/students/download/csv`,{
            responseType:'blob'
        });
        return response.data;
    },
    toggleEmailReminders:async(id)=>{
        const response = await api.post(`/students/${id}/toggle-reminders`);
        return response.data;
    }
};

export const cronAPI ={
    updateCronSchedule:async(schedule)=>{
        const response =  await api.put('/cron/schedule',{schedule});
        return response.data;
    },
    getCurrentSchedule: async()=>{
        const response = await api.get('/cron/schedule');
        return response.data;
    },
    triggerManualSync:  async()=>{
        const response= await api.post(`/cron/sync`);
        return response.data;
    },
    triggerManualSyncForStudent:async (studentId) =>{
        const response = await api.post(`/cron/sync/${studentId}`);
        return response.data;
    }
};

api.interceptors.response.use(
    (response)=> response,
    (error)=>{
        const errorMessage = error.response?.data?.message|| 'An error occured';
        console.error('API error:',errorMessage);
        return Promise.reject(error);
    }
);
export default api;