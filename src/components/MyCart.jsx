import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MyCartItemCard from './MyCartItemCard';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';

const baseUrl = import.meta.env.VITE_BASE_URL;

// eslint-disable-next-line react/prop-types
export default function MyCart() {
  const [myCart, setMyCart] = useState([]);
  const [state, setState] = useState({ right: false });
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    if (savedToken) setToken(JSON.parse(savedToken));
    else console.log("No Data found");
  }, []);
  
  useEffect(() => {
    fetchData(`${baseUrl}/user/cart`);
  }, [token]); 
  

  const fetchData = async (url) => {
    if (!token) return; 
   
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) setMyCart(response.data.oblist);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
     
    } 
      
  };

  const handleOrderRequest = async () => {
    if (myCart.length === 0) {
      console.warn("Cart is empty. Cannot proceed to checkout.");
      setOpen(true);
      return;
    }
    try {
      await Promise.all(myCart.map(cart => handleRemoveItem(cart.cartId)));
      
      const response = await axios.get(`${baseUrl}/user/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Checkout Successful", response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error(`Error during checkout:`, error);
     
    } 
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const itemIdInt = parseInt(itemId, 10);
      const response = await axios.delete(`${baseUrl}/user/cart?cartId=${itemIdInt}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Item removed from cart successfully:", response.data);
    } catch (error) {
      console.error('Error Removing Item:', error);
      // Optionally provide user feedback here
    }
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: 450, marginTop: 8 }}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {myCart.map((cart) => (
        <MyCartItemCard
          key={cart.cartId} // Ensure cartId is unique
          itemId={cart.cartId}
          itemName={cart.productName}
          itemQuantity={cart.quantity}
          itemPrice={cart.price}
          myToken={token}
        />
      ))}
      <Divider sx={{ marginTop: 8 }} />
      Total Price
      <Button variant='filled' onClick={handleOrderRequest}>Check Out</Button>
    </Box>
  );

  const [open, setOpen] = useState(false);
  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <ShoppingCartIcon />
          </Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert  onClose={handleClose}  severity="error" variant="filled"  sx={{ width: '100%' }} >
          Cart is empty
        </Alert>
      </Snackbar>
    </div>
    
  );
}
