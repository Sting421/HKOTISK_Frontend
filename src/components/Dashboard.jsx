import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import SchoolIcon from '@mui/icons-material/School';

import InfoIcon from '@mui/icons-material/Info';
import ClassIcon from '@mui/icons-material/Class';
const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'Students',
    title: 'Students',
    icon: <SchoolIcon/>,
  },
  {
    segment: 'classes',
    title: 'Classes',
    icon: <ClassIcon/>,
    children: [
      {
        segment: 'CSIT 340',
        title: 'CSIT 340',
        icon: <SchoolIcon />,
      },
      {
        segment: 'CSIT 321',
        title: 'CSIT 321',
        icon: <SchoolIcon />,
      },
    ],
  },
  {kind:'divider'},  
  {
    segment: 'Info',
    title: 'Info',
    icon: <InfoIcon/>,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
    <Typography>
    {pathname === '/dashboard' && <Typography>Welcome to the Dashboard</Typography>}
      {pathname === '/Students' && (
        <Box>
          <Typography variant="h4">Students</Typography>
          <Typography variant="body1">List of students or any other content related to students.</Typography>
        </Box>
        
      )}

        {pathname === '/classes/CSIT%20340' && (
          <Box>
            <Typography variant="h4">Class CSIT 340</Typography>
              
          </Box>
        )}
        {/* {pathname} */}
    

    
      </Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function MyDashboard(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="src\res\hkotiskLogo.svg" alt="Logo" />,
        title: '',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={pathname} />
       
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

MyDashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default MyDashboard;
