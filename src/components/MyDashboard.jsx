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
import MyItemCard from './ui/MyItemCard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import axios from 'axios';
import './css/dashboard.css'; 
import AddProducts from './staff/AddProducts';
import MyCart from './MyCart';
import MyLogOut from './auth/MyLogOut';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import MyViewOrders from './staff/MyViewOrders';

import Logo from "../assets/componentsRes/hkotiskLogo.png"
import { SearchIcon } from 'lucide-react';
import { InputAdornment, TextField } from '@mui/material';
import MyUpdateProductNew from './staff/MyUpdateProduct';
import MyUpdateProduct from './staff/MyUpdateProduct';
const baseUrl = import.meta.env.VITE_BASE_URL;


const STUDENT_NAVIGATION = [
  { segment: 'Favorites', title: 'Favorites', icon: <DashboardIcon /> },
  { segment: 'Snacks', title: 'Snacks', icon: <FastfoodIcon /> },
  { segment: 'Food', title: 'Food', icon: <LocalPizzaIcon /> },
  { segment: 'Beverage', title: 'Beverage', icon: <LocalDrinkIcon /> },

  { kind: 'divider' },
  { segment: 'Info', title: 'Info', icon: <InfoIcon /> },
];
const STAFF_NAVIGATION = [
      { segment: 'ViewProducts', title: 'View Products', icon: <AddCircleOutlineIcon /> },
      { segment: 'AddProducts', title: 'Add Products', icon: <AddCircleOutlineIcon /> },
      { segment: 'UpdateProducts', title: 'Update Products', icon: <ModeEditOutlineIcon /> },
      { segment: 'ViewOrders', title: 'View Orders', icon: <FormatListBulletedIcon /> },
      { segment: 'WaitingArea', title: 'Waiting Area', icon: <FormatListBulletedIcon /> },
  
  { kind: 'divider' },
  { segment: 'Info', title: 'Info', icon: <InfoIcon /> },
];
const NAVIGATION = [
  { segment: 'Favorites', title: 'Favorites', icon: <DashboardIcon /> },
  { segment: 'Snacks', title: 'Snacks', icon: <FastfoodIcon /> },
  
   
  { segment: 'AddProducts', title: 'AddProducts', icon: <AddCircleOutlineIcon /> },
  
  { segment: 'UpdateProducts', title: 'UpdateProducts', icon: <ModeEditOutlineIcon /> },

  { segment: 'ViewOrders', title: 'ViewOrders', icon: <FormatListBulletedIcon /> },

  { segment: 'WaitingArea', title: 'WaitingArea', icon: <FormatListBulletedIcon /> },
   

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
    if (response.status === 200){
      setData(response.data.oblist);
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
  }
};
const getRole = async (url, token, setData) => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200){
      setData(response.data.role);
     
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
  }
};

function MyDashboard({ window }) {
  const [pathname, setPathname] = useState('/Snacks');
  const [token, setToken] = useState('');
  const [products, setProducts] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [myRole,setMyRole] = useState('');
  const [newProduct, setNewProduct] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    if (savedToken) setToken(JSON.parse(savedToken));
    else console.log("No Data found");
  
  }, []);
  useEffect(() => {
    if (token) {
    getRole(`${baseUrl}/auth/role`, token, setMyRole);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData(`${baseUrl}/user/product`, token, setProducts);
    }
    setIsDeleted(false);
    setNewProduct(false)
  }, [isDeleted,newProduct]);

  const router = useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: setPathname,
  
  }), [pathname]);
  // const handleOnChangeSearch = (e) => {
  //   setSearch(e.target.value);
  //   console.log(search)
  // };
  const [isConnected, setIsConnected] = useState(false);

      useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws/products');
      
        // Handle connection open
        socket.onopen = () => {
          console.log('WebSocket connection established');
          setIsConnected(true); // Update connection state
        };
      
        
        socket.onmessage = (event) => {
          console.log('Message received:', event.data);
          setNewProduct(true);
        };
      
        
        socket.onclose = () => {
          console.log('WebSocket connection closed');
          setIsConnected(false); 
        };
      
      
        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      
      
        return () => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.close();
          }
        };
      }, []);
      const handleOnChangeSearch = (e) => {
        setSearch(e.target.value);
        console.log(search)
      };
  const filteredProducts = useMemo(() => {
        return products.filter(product => 
          product.productName.toLowerCase().includes(search.toLowerCase())
        );
      }, [products, search]);
      
  const DemoPageContent = useCallback(() => (

    <Box sx={{ py: 4, display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', alignItems: 'center' }}>
      {pathname === '/dashboard' && <Typography>Welcome to the Dashboard</Typography>}
      {pathname === '/ViewProducts' && 
      products.map(product => (
        
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
      {pathname === '/Snacks' && 
      products.map(product => (
        
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
     {pathname === '/Food' && filteredProducts
      .filter(product => product.category === 'Food')
      .sort((a, b) => a.productName.localeCompare(b.productName))
      .map(product => (
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
      {pathname === '/Beverage'  && 
        products
          .filter(order => order.category === 'Beverage')
          .map(product => (
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




      { pathname === '/UpdateProducts' &&
       products
       .sort((a, b) => a.productName.localeCompare(b.productName))
       .map(product => (
        <MyUpdateProduct
          key={product.productId}
          productId={parseInt(product.productId, 10)}
          price={product.prices}
          itemName={product.productName}
          itemImage={product.productImage || '/src/assets/componentsRes/hkotiskLogo.png'}
          itemDescription={product.description}
          itemSize={product.sizes}
          itemQuantity={product.quantity}
          myToken={token}
          setIsDeleted={setIsDeleted}
        />
      ))}
      { pathname === '/AddProducts' && <AddProducts baseUrl={baseUrl} getToken={token} />}
      { pathname === '/ViewOrders' && <MyViewOrders token={token}/>}
      { pathname === '/WaitingArea' && <MyViewOrders token={token}/>}
    </Box>
  ), [pathname, products, search,token]);
  
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
      navigation={myRole === 'staff' ?  STAFF_NAVIGATION : STUDENT_NAVIGATION}
      // navigation={NAVIGATION}
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
