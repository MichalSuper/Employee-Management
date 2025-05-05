import { useEffect, useState } from 'react';
import {
  getAllEmployees,
  deleteEmployee,
  getEmployeeByUserId,
} from '../api/employee';
import { useUser } from '../contexts/UserContext';
import {
  Box,
  Typography,
  IconButton,
  Container,
  CircularProgress,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
} from '@mui/material';
import { Delete, Edit, Visibility, Add } from '@mui/icons-material';
import ViewEmployeeModal from './ViewEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import AddEmployeeModal from './AddEmployeeModal';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  start_date?: string;
  job_title?: string;
  user_email?: string;
  job?: {
    name: string;
  };
}

export default function DashboardPage() {
  const { user } = useUser();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeDetails, setEmployeeDetails] = useState<Employee | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const token = user?.token;

  useEffect(() => {
    if (!token) return;

    if (user?.role === 'admin') {
      fetchEmployees();
    } else if (user?.role === 'employee') {
      fetchEmployeeDetails();
    }
  }, [user, token]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      if (!user?.token) {
        setErrorMessage('Authentication error: No token found');
        return;
      }
      const data = await getAllEmployees(user?.token);
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      if (!user?.token) {
        setErrorMessage('Authentication error: No token found');
        return;
      }
      const data = await getEmployeeByUserId(user?.token);
      setEmployeeDetails(data);
    } catch (error) {
      console.error('Failed to fetch employee details', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (!user?.token) {
        setErrorMessage('Authentication error: No token found');
        return;
      }
      await deleteEmployee(id, user?.token);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error('Failed to delete employee', error);
    }
  };

  if (!user) return null;

  return (
    <Container sx={{ mt: 5 }}>
      {user.role === 'employee' ? (
        <Box>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {employeeDetails ? (
            <>
              <Typography variant="h4" gutterBottom>
                Welcome, {employeeDetails.first_name} {employeeDetails.last_name}
              </Typography>
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6">Employee Details</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography><strong>Email:</strong> {employeeDetails.email}</Typography>
                <Typography><strong>Phone:</strong> {employeeDetails.phone || 'N/A'}</Typography>
                <Typography><strong>Address:</strong> {employeeDetails.address || 'N/A'}</Typography>
                <Typography><strong>Birth Date:</strong> {employeeDetails.birth_date || 'N/A'}</Typography>
                <Typography><strong>Start Date:</strong> {employeeDetails.start_date || 'N/A'}</Typography>
                <Typography><strong>Job:</strong> {employeeDetails.job_title || 'N/A'}</Typography>
              </Paper>
            </>
          ) : (
            <CircularProgress />
          )}
        </Box>
      ) : (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Employees List</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setIsAddOpen(true)}
            >
              Add Employee
            </Button>
          </Box>
          {loading ? (
            <CircularProgress />
          ) : (
            <List>
              {employees.map((emp) => (
                <ListItem key={emp.id} divider>
                  <ListItemText primary={`${emp.first_name} ${emp.last_name}`} />
                  <IconButton onClick={() => setViewId(emp.id)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => setEditId(emp.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(emp.id)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}

      {viewId && (
        <ViewEmployeeModal
          employeeId={viewId}
          token={user.token}
          open={true}
          onClose={() => setViewId(null)}
        />
      )}

      {editId && (
        <EditEmployeeModal
          employeeId={editId}
          token={user.token}
          open={true}
          onClose={() => setEditId(null)}
          onUpdate={fetchEmployees}
        />
      )}

      {isAddOpen && (
        <AddEmployeeModal
          token={user.token}
          open={true}
          onClose={() => setIsAddOpen(false)}
          onAdd={fetchEmployees}
        />
      )}
    </Container>
  );
}
