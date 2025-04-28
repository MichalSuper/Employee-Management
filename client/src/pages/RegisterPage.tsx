import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { registerUser } from '../api/auth';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';


interface RegisterFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

interface DecodedToken {
  id: number;
  role: 'admin' | 'employee';
}

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { token } = await registerUser({ email: data.email, password: data.password });
      const decoded = jwtDecode<DecodedToken>(token);
      setUser({ id: decoded.id, role: decoded.role, token });
      navigate('/complete-profile', { state: { email: data.email } }); 
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{
        mt: 8,
        p: 4,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: '#fff',
      }}>
        <Typography variant="h4" component="h1" gutterBottom>Register</Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email', { required: 'Required field' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', {
              required: 'Required field',
              minLength: { value: 6, message: 'At least 6 characters' },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('confirmPassword', {
              validate: value => value === watch('password') || 'Passwords do not match',
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
        </form>
        <Button onClick={() => navigate('/')} color="secondary" sx={{ mt: 2 }}>
          Already have an account? Login
        </Button>
      </Box>
    </Container>
  );
}
