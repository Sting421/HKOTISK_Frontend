
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MyCartItemCard from './MyCartItemCard';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Card, CardContent, Snackbar, Typography } from '@mui/material';

const baseUrl = import.meta.env.VITE_BASE_URL;


export default function MyCart() {
  const [myCart, setMyCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [token, setToken] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
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
  
  }, [token,drawerOpen,isDeleted]);

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
  }, [myCart]);
  
  const CartList = () => (
    <Box sx={{ width: 400, marginTop: 8 }} role="presentation">
      {myCart.map((cart) => (
        <MyCartItemCard
          key={cart.cartId}
          itemId={cart.cartId}
          itemName={cart.productName}
          itemQuantity={cart.quantity}
          itemPrice={cart.price}
          itemSize={cart.productSize}
          myToken={token}
          setIsDeleted={setIsDeleted}
        />
        
      ))}
      <Divider sx={{ marginTop: 8 }} />
        <Card sx={{ maxWidth: 350, width: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Typography variant="h6" component="span" fontWeight="medium">
              Total
            </Typography>
            <Typography variant="h6" component="span" fontWeight="medium">
            ₱ {totalPrice.toFixed(2)}
            </Typography>
          </div>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            fullWidth 
            sx={{ backgroundColor: '#883c40', '&:hover': { backgroundColor: '#c7565b' } }}
            onClick={handleOrderRequest}
          >
            Checkout
          </Button>
        </CardContent>
      </Card>
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

