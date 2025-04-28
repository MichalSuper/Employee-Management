import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { completeProfile } from '../api/employee'
import { getJobs } from '../api/job';
import { useUser } from '../contexts/UserContext';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Alert, 
  CircularProgress, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl 
} from '@mui/material';

interface CompleteProfileInputs {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  start_date?: string;
  job_id?: number;
}

interface Job {
  id: number;
  name: string;
}

export default function CompleteProfilePage() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CompleteProfileInputs>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  // קבלת האימייל מה-state שהועבר מהרישום
  const email = (location.state as { email?: string })?.email;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (email) {
      setValue('email', email);
    }
    fetchJobs();
  }, [email, user, navigate, setValue]);

  const fetchJobs = async () => {
    try {
      if (!user?.token) {
        setErrorMessage('Authentication error: No token found');
        return;
      }
      const jobsData = await getJobs(user?.token);
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const onSubmit = async (data: CompleteProfileInputs) => {
    setLoading(true);
    setErrorMessage('');
    try {
      if (!user?.token) {
        setErrorMessage('Authentication error: No token found');
        return;
      }
      await completeProfile(data, user?.token);
      navigate('/dashboard');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Profile completion failed');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Missing email information. Please register again.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, border: '1px solid #ccc', borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Complete Your Profile
        </Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            {...register('first_name', { required: 'Required field' })}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            {...register('last_name', { required: 'Required field' })}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            disabled
            {...register('email')}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            {...register('phone')}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            {...register('address')}
          />
          <TextField
            label="Birth Date"
            type="date"
            fullWidth
            margin="normal"
            {...register('birth_date')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            {...register('start_date')}
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="job-label">Job</InputLabel>
            <Select
              labelId="job-label"
              defaultValue=""
              {...register('job_id', { required: 'Required field' })}
            >
              {jobs.map((job) => (
                <MenuItem key={job.id} value={job.id}>
                  {job.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Profile'}
          </Button>
        </form>
      </Box>
    </Container>
  );
}
