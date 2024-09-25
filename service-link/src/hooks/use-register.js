import { axiosInstance } from '../services/interceptor';



const useRegister = () => {

    const registerUser = async (userData) => {
        try {
          const response = await axiosInstance.post('/user/add', userData);
          return response.data; // Return the response data
        } catch (error) {
          console.error('Error registering user:', error.response ? error.response.data : error.message);
          throw error; // Throw error to be handled by the component
        }
      };

  return{registerUser}
};

export default useRegister;
