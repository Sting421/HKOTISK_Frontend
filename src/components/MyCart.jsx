
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

export default function MyCart() {
  const [myCart, setMyCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [token, setToken] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    if (savedToken) {
      setToken(JSON.parse(savedToken));
    } else {
      console.log("No token found");
    }
  }, []);

  useEffect(() => {
    if (token) fetchData(`${baseUrl}/user/cart`);
    
  }, [token]);

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setMyCart(response.data.oblist);
      }
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };
  

  const handleOrderRequest = async () => {
    if (myCart.length === 0) {
      console.warn("Cart is empty. Cannot proceed to checkout.");
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const response = await axios.post(`${baseUrl}/user/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });
       console.log(response)
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setCheckout(false); 
     
    }
  };
  

  const deleteItems = () => {
    myCart.forEach((cartItem) => handleRemoveItem(cartItem.cartId));
    setMyCart([]); // Clear cart locally after deletion
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await axios.delete(`${baseUrl}/user/cart?cartId=${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyCart((prevCart) => prevCart.filter((item) => item.cartId !== itemId));
      console.log("Item removed from cart:", response.data);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const CartList = () => (
    <Box sx={{ width: 450, marginTop: 8 }} role="presentation">
      {myCart.map((cart) => (
        <MyCartItemCard
          key={cart.cartId}
          itemId={cart.cartId}
          itemName={cart.productName}
          itemQuantity={cart.quantity}
          itemPrice={cart.price}
          myToken={token}
        />
      ))}
      <Divider sx={{ marginTop: 8 }} />
      Total Price
      <Button variant="contained" onClick={handleOrderRequest}>
        Check Out
      </Button>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <ShoppingCartIcon />
      </Button>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <CartList />
      </Drawer>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ width: '100%' }}>
          Cart is empty
        </Alert>
      </Snackbar>
    </div>
  );
}
