import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../services/interceptor';
import { useNavigate } from 'react-router-dom';

const useLogin=()=>{
  const navigate = useNavigate();

    const getLogin = useMutation({
        mutationFn: (data) => {
          return axiosInstance.post('/user/login', { ...data }).then((res) => res.data);
        },
        onSuccess: ({ accessToken, refreshToken, userName, role,id,userId }) => {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('role', role);
          localStorage.setItem('username', userName);
          localStorage.setItem('employeeId', id);
          localStorage.setItem('userId', userId);

          navigate('/dashboard');
        },
        onError: () => {},
      });
      return {getLogin};
};
export default useLogin;