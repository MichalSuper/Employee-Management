import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useUser } from '../contexts/UserContext';
import {jwtDecode} from 'jwt-decode';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
//import './loginPage.css';

interface LoginFormInputs {
  email: string;
  password: string;
}

interface DecodedToken {
  id: number;
  role: 'admin' | 'employee';
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { token } = await loginUser(data);
      const decoded = jwtDecode<DecodedToken>(token);
      setUser({ id: decoded.id, role: decoded.role, token });
      navigate('/dashboard'); 
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="login-container" sx={{
        mt: 8,
        p: 4,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: '#fff',
      }}>
        <Typography variant="h4" component="h1" gutterBottom>Login</Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email', { required: 'Required field'})}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', { required: 'Required field'})}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
        <Button onClick={() => navigate('/register')} color="primary" sx={{ mt: 2 }}>
        Don't have an account? Sign up
        </Button>
      </Box>
    </Container>
  );
}
