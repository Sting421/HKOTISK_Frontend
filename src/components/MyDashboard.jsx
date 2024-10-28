import * as React from 'react';
import { useState , useEffect} from 'react';
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
import MyItemCard from './MyItemCard';
import axios from 'axios';
import FastfoodIcon from '@mui/icons-material/Fastfood';



const baseUrl = import.meta.env.VITE_BASE_URL; 



const NAVIGATION = [
  {
    segment: 'Favorites',
    title: 'Favorites',
    icon: <DashboardIcon />,
  },
  {
    segment: 'Snacks',
    title: 'Snacks',
    icon: <FastfoodIcon/>,
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
  
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGRyaW5AZ21haWwuY29tIiwiaWF0IjoxNzMwMTM0ODIyLCJleHAiOjE3MzAyMjEyMjJ9.8HUB8CvR9koCJRyPPUhG1EZZUZUGk5_eyKKc-Xd1G1I";
        const response = await axios.get(`${baseUrl}/user/products`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        if (response.status === 200) {
          setProducts(response.data.oblist); // Set the products state with the oblist
        } else {
          console.error('Error fetching products:', response.message); // Handle non-200 statuses
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, []);

  
  
function DemoPageContent({ pathname }) {

  return (
    
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexWrap: 'wrap', 
        gap: '40px',
        
      }}
    >
          {pathname === '/dashboard' && <Typography>Welcome to the Dashboard</Typography>}
          {pathname === '/Snacks' && (
            <>
              {products.map(product => (
                <MyItemCard 
                  key={product.productId} 
                  itemName={product.productName} 
                  itemImage={product.productImage || '/src/assets/componentsRes/hkotiskLogo.png'} 
                  itemDescription={product.description} 
                  itemPrice={product.price} 
                />
              ))}
            </>
          )}

    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};


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
        <DemoPageContent pathname={pathname}/>
          
       
        
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