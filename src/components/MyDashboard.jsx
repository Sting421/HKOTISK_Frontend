import  { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import InfoIcon from '@mui/icons-material/Info';
import MyItemCard from './MyItemCard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import axios from 'axios';
import './css/dashboard.css'; 
import AddProducts from './AddProducts';
import MyCart from './MyCart';
import MyLogOut from './MyLogOut';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import MyUpdateProducts from './MyUpdateProducts';
import MyViewOrders from './MyViewOrders';

import Logo from "../assets/componentsRes/hkotiskLogo.png"
const baseUrl = import.meta.env.VITE_BASE_URL;

const NAVIGATION = [
  { segment: 'Favorites', title: 'Favorites', icon: <DashboardIcon /> },
  { segment: 'Snacks', title: 'Snacks', icon: <FastfoodIcon /> },
  {
    segment: 'Staff', title: 'Staff', icon: <ManageAccountsIcon />,
    children: [
      { segment: 'AddProducts', title: 'AddProducts', icon: <AddCircleOutlineIcon /> },
      
      { segment: 'UpdateProducts', title: 'UpdateProducts', icon: <ModeEditOutlineIcon /> },
    
      { segment: 'ViewOrders', title: 'ViewOrders', icon: <FormatListBulletedIcon /> },
    ],
  },
  { kind: 'divider' },
  { segment: 'Info', title: 'Info', icon: <InfoIcon /> },
];

const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: 'data-toolpad-color-scheme' },
  colorSchemes: { light: true, dark: true },
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});

const fetchData = async (url, token, setData) => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) setData(response.data.oblist);
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
  }
};

function MyDashboard({ window }) {
  const [pathname, setPathname] = useState('/dashboard');
  const [token, setToken] = useState('');
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState([]);
 

 
  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    if (savedToken) setToken(JSON.parse(savedToken));
    else console.log("No Data found");
  
  }, []);

  useEffect(() => {
    if (token) {
      fetchData(`${baseUrl}/user/product`, token, setProducts);
    }
  }, [pathname]);

  const router = useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: setPathname,
  }), [pathname]);

  const DemoPageContent = useCallback(() => (
    <Box sx={{ py: 4, display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
      {pathname === '/dashboard' && <Typography>Welcome to the Dashboard</Typography>}
      {pathname === '/Snacks' && products.map(product => (
        
        <MyItemCard
          key={product.productId}
          productId={parseInt(product.productId, 10)}
          price={product.prices}
          itemName={product.productName}
          itemImage={product.productImage || '/src/assets/componentsRes/hkotiskLogo.png'}
          itemDescription={product.description}
          itemSize={product.sizes}
          itemQuantity={product.quantity}
          myToken={token}
        />
       
      ))}


      {pathname === '/Staff/UpdateProducts' && products.map(product => (
        <MyUpdateProducts
          key={product.productId}
          productId={parseInt(product.productId, 10)}
          price={product.price}
          itemName={product.productName}
          itemImage={product.productImage || '/src/assets/componentsRes/hkotiskLogo.png'}
          itemDescription={product.description}
          itemSize={product.sizes}
          itemQuantity={product.quantity}
          myToken={token}
        />
      ))}
      {pathname === '/Staff/AddProducts' && <AddProducts baseUrl={baseUrl} getToken={token} />}
      {pathname === '/Staff/ViewOrders' && <MyViewOrders token={token}/>}
    </Box>
  ), [pathname, products, token]);
  
  function MyCartFunc() {
    return (
      <>
        <MyCart sx={{ display: 'flex', justifyContent: 'center' }} />
        <div><MyLogOut /></div>
      </>
    );
  }
  
 
  
  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{ logo: <img src={Logo} alt="Logo" />, title: '' }}
      router={router}
      theme={demoTheme}
      window={typeof window !== 'undefined' ? window() : undefined}
      
    >
     <DashboardLayout 
      slots={{ toolbarActions: MyCartFunc }} 
      sx={{ height: "100vh" }}
    >
        <DemoPageContent />
      </DashboardLayout>
    </AppProvider>
  );
}


MyDashboard.propTypes = {
  window: PropTypes.func,
};

export default MyDashboard;
