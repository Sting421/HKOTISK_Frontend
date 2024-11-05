
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MyCartItemCard from './MyCartItemCard';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

const baseUrl = import.meta.env.VITE_BASE_URL;


export default function MyCart() {
  const [myCart, setMyCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [token, setToken] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0.00);

  const [orderData] = useState([]);
    

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
    setIsDeleted(false);
  
  }, [token,drawerOpen,isDeleted,isUpdated]);

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setMyCart(response.data.oblist);
      }
      console.log("Fetching Data")
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
      const response = await axios.post(
        `${baseUrl}/user/order`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } })
        console.log("CheckOut successful:", response.data);
        setIsDeleted(true);
          
       console.log(response)
    } catch (error) {
      
      console.error("Error during checkout:", error);
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
  const calculateTotalPrice = () => {
    return myCart.reduce((total, cart) => total + cart.price * cart.quantity, 0);
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
      setIsUpdated(false);
  }, [myCart,isUpdated]);
  
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
          setIsDeleted={setIsDeleted}
          setIsUpdated={setIsUpdated}
        />
        
      ))}
      <Divider sx={{ marginTop: 8 }} />
      <div style={{
          display: 'flex',
          justifyContent: 'space-between', // or 'center', 'flex-start', etc.
          alignItems: 'center',
      }}>
      Total Price : {totalPrice.toFixed(2)}
      <Button variant="contained" onClick={handleOrderRequest} sx={{mr:2, mt:2}}>
        Check Out
      </Button>
      </div>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}sx={{mt:0.6}}>
        <ShoppingCartIcon  size='large'/>
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
