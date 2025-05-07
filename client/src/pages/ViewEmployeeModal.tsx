// ViewEmployeeModal.tsx
import React, { useEffect, useState } from 'react';
import ModalWindow from '../components/ModalWindow';
import { getEmployeeById } from '../api/employee';

interface ViewEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employeeId: number;
  token: string;
}

const ViewEmployeeModal: React.FC<ViewEmployeeModalProps> = ({ open, onClose, employeeId, token }) => {
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    if (open) {
      getEmployeeById(employeeId, token).then(setEmployee);
    }
  }, [open, employeeId, token]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  if (!employee) return null;

  return (
    <ModalWindow open={open} onClose={onClose}>
      <div className="grid gap-2">
        <p><strong>First Name:</strong> {employee.first_name}</p>
        <p><strong>Last Name:</strong> {employee.last_name}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Phone:</strong> {employee.phone || '-'}</p>
        <p><strong>Address:</strong> {employee.address || '-'}</p>
        <p><strong>Birth Date:</strong> {formatDate(employee.birth_date)}</p>
        <p><strong>Start Date:</strong> {formatDate(employee.start_date)}</p>
        <p><strong>Job:</strong> {employee.job_title || '-'}</p>
      </div>
    </ModalWindow>
  );
};

export default ViewEmployeeModal;