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
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Avatar,
  Chip,
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  if (!user) return null;

  return (
    <Box sx={{ bgcolor: '#f5f8f5', minHeight: '100vh', py: 3 }}>
      <Container sx={{ mt: 5 }} >
        {errorMessage && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setErrorMessage('')}
          >
            {errorMessage}
          </Alert>
        )}
        
        {user.role === 'employee' ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center',
            maxWidth: '800px',
            mx: 'auto'
          }}>
            {loading ? (
              <CircularProgress color="primary" sx={{ mt: 5 }} />
            ) : employeeDetails ? (
              <>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    width: '100%', 
                    mb: 2, 
                    py: 3,
                    background: 'linear-gradient(to right, #2e7d32, #4caf50)',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="h4" gutterBottom fontWeight="bold">
                    Welcome, {employeeDetails.first_name} {employeeDetails.last_name}
                  </Typography>
                </Paper>
                
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 4, 
                    mt: 2, 
                    maxWidth: 740, 
                    width: '100%', 
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        bgcolor: 'primary.main', 
                        fontSize: 30, 
                        mb: 2 
                      }}
                    >
                      {employeeDetails.first_name.charAt(0)}{employeeDetails.last_name.charAt(0)}
                    </Avatar>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Chip 
                      label={employeeDetails.job_title || 'Employee'} 
                      color="primary" 
                      sx={{ mb: 2 }}
                    />
                  </Box>
                  
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ mb: 1.5 }}>
                      <strong>Email:</strong> {employeeDetails.email}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }}>
                      <strong>Phone:</strong> {employeeDetails.phone || 'N/A'}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }}>
                      <strong>Address:</strong> {employeeDetails.address || 'N/A'}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }}>
                      <strong>Birth Date:</strong> {formatDate(employeeDetails.birth_date)}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }}>
                      <strong>Start Date:</strong> {formatDate(employeeDetails.start_date)}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }}>
                      <strong>Job:</strong> {employeeDetails.job_title || 'N/A'}
                    </Typography>
                  </Box>
                </Paper>
              </>
            ) : (
              <Typography>No employee details found</Typography>
            )}
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            maxWidth: '800px',
            mx: 'auto'
          }}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                width: '100%',
                mb: 4
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
                Employees List
              </Typography>
            </Box>
            
            {loading ? (
              <CircularProgress />
            ) : (
              <Paper 
                elevation={2} 
                sx={{ 
                  width: '100%', 
                  borderRadius: 2, 
                  overflow: 'hidden' 
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                  <IconButton 
                    color="primary"
                    onClick={() => setIsAddOpen(true)}
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    <Add />
                  </IconButton>
                </Box>
                <List sx={{ width: '100%' }}>
                  {employees.map((emp) => (
                    <ListItem 
                      key={emp.id} 
                      divider
                      sx={{ 
                        '&:hover': { 
                          bgcolor: '#f0f7f0'
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          mr: 2 
                        }}
                      >
                        {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                      </Avatar>
                      <ListItemText 
                        primary={`${emp.first_name} ${emp.last_name}`} 
                        secondary={emp.email}
                        sx={{ flex: 1 }}
                      />
                      <Box>
                        <IconButton 
                          onClick={() => setViewId(emp.id)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton 
                          onClick={() => setEditId(emp.id)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(emp.id)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                  
                  {employees.length === 0 && (
                    <ListItem sx={{ justifyContent: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        No employees found
                      </Typography>
                    </ListItem>
                  )}
                </List>
              </Paper>
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
    </Box>
  );
}