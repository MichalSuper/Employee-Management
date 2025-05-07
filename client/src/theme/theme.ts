import { createTheme } from '@mui/material/styles';

const greenTheme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // dark green
      light: '#4caf50', // medium green
    },
    secondary: {
      main: '#81c784', // light green
    },
    background: {
      default: '#f9f9f9',
    },
  },
});

export default greenTheme;
