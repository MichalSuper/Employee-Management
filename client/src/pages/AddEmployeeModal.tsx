import React, { useEffect, useState } from 'react';
import ModalWindow from '../components/ModalWindow';
import { addEmployee } from '../api/employee';
import { getJobs } from '../api/job';
import { Button, TextField, MenuItem } from '@mui/material';

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  token: string;
  onAdd: () => void;
}

interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  start_date?: string;
  job_id?: number;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ open, onClose, token, onAdd }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    start_date: '',
    job_id: undefined
  });

  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    if (open) getJobs(token).then(setJobs);
  }, [open, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'job_id' ? Number(value) : value
    }));
  };

  const handleSubmit = async () => {
    await addEmployee(formData, token);
    onAdd();
    onClose();
  };

  return (
    <ModalWindow open={open} onClose={onClose}>
      <div className="grid gap-2">
        <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
        <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} />
        <TextField label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
        <TextField label="Address" name="address" value={formData.address || ''} onChange={handleChange} />
        <TextField
          label="Birth Date"
          name="birth_date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.birth_date || ''}
          onChange={handleChange}
        />
        <TextField
          label="Start Date"
          name="start_date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.start_date || ''}
          onChange={handleChange}
        />
        <TextField
          select
          label="Job"
          name="job_id"
          value={formData.job_id ?? ''}
          onChange={handleChange}
        >
          {jobs.map(job => (
            <MenuItem key={job.id} value={job.id}>{job.title}</MenuItem>
          ))}
        </TextField>
        <Button onClick={handleSubmit} variant="contained">Add</Button>
      </div>
    </ModalWindow>
  );
};

export default AddEmployeeModal;
