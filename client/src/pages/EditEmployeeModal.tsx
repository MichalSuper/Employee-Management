import React, { useEffect, useState } from 'react';
import ModalWindow from '../components/ModalWindow';
import { getEmployeeById, updateEmployee } from '../api/employee';
import { getJobs } from '../api/job';
import { Button, TextField, MenuItem, Box } from '@mui/material';

interface EditEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employeeId: number;
  token: string;
  onUpdate: () => void;
}

interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  start_date?: string;
  job_id?: string;
}

interface Job {
  id: number;
  title: string;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  open,
  onClose,
  employeeId,
  token,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    start_date: '',
    job_id: '',
  });

  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (open) {
      getEmployeeById(employeeId, token).then((data) => {
        const {
          first_name,
          last_name,
          email,
          phone,
          address,
          birth_date,
          start_date,
          job_id,
        } = data;
        setFormData({
          first_name,
          last_name,
          email,
          phone: phone || '',
          address: address || '',
          birth_date: birth_date || '',
          start_date: start_date || '',
          job_id: job_id?.toString() || '',
        });
      });

      getJobs(token).then(setJobs);
    }
  }, [open, employeeId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await updateEmployee(employeeId, {
      ...formData,
      job_id: formData.job_id ? parseInt(formData.job_id) : undefined,
    }, token);
    onUpdate();
    onClose();
  };

  return (
    <ModalWindow open={open} onClose={onClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField 
          fullWidth
          label="First Name" 
          name="first_name" 
          value={formData.first_name} 
          onChange={handleChange} 
        />
        <TextField 
          fullWidth
          label="Last Name" 
          name="last_name" 
          value={formData.last_name} 
          onChange={handleChange} 
        />
        <TextField 
          fullWidth
          label="Email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
        />
        <TextField 
          fullWidth
          label="Phone" 
          name="phone" 
          value={formData.phone || ''} 
          onChange={handleChange} 
        />
        <TextField 
          fullWidth
          label="Address" 
          name="address" 
          value={formData.address || ''} 
          onChange={handleChange} 
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Birth Date"
            name="birth_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.birth_date || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Start Date"
            name="start_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.start_date || ''}
            onChange={handleChange}
          />
        </Box>
        
        <TextField
          fullWidth
          select
          label="Job"
          name="job_id"
          value={formData.job_id || ''}
          onChange={handleChange}
        >
          {jobs.map((job) => (
            <MenuItem key={job.id} value={job.id.toString()}>
              {job.title}
            </MenuItem>
          ))}
        </TextField>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
          >
            Save
          </Button>
        </Box>
      </Box>
    </ModalWindow>
  );
};

export default EditEmployeeModal;