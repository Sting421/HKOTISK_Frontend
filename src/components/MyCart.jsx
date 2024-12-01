import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import MyCartItemCard from './ui/MyCartItemCard';
import axios from 'axios';
import { Alert, Badge, Card, CardContent, IconButton, Snackbar, Typography } from '@mui/material';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function MyCart() {
  const [myCart, setMyCart] = useState([]);
  const [productData, setProductData] = useState([]);
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
    if (token) {
      fetchData(`${baseUrl}/user/cart`, setMyCart);
      fetchData(`${baseUrl}/user/product`, setProductData);
    }
    setIsDeleted(false);
    setIsUpdated(false);
  }, [token, drawerOpen, isDeleted, isUpdated]);

  const fetchData = async (url, data) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        data(response.data.oblist);
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
    <Box sx={{ width: { xs: '100%', sm: 400 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Your Cart</Typography>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {myCart.map((cart) => (
          <MyCartItemCard
            key={cart.cartId}
            itemId={cart.cartId}
            productId={cart.productId}
            itemName={cart.productName}
            itemQuantity={cart.quantity}
            itemPrice={cart.price}
            itemSize={cart.productSize}
            myToken={token}
            setIsUpdated={setIsUpdated}
            setIsDeleted={setIsDeleted}
          />
        ))}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Card elevation={0} sx={{ bgcolor: 'background.default' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="span" fontWeight="medium">
                Total
              </Typography>
              <Typography variant="h6" component="span" fontWeight="medium">
                ₱ {totalPrice.toFixed(2)}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              fullWidth 
              sx={{ bgcolor: '#883c40', '&:hover': { bgcolor: '#c7565b' } }}
              onClick={handleOrderRequest}
              disabled={myCart.length === 0}
            >
              Checkout
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  return (
    <div>
      <IconButton 
        onClick={() => setDrawerOpen(!drawerOpen)} 
        color="primary" 
        sx={{ color: '#008ECC' }}
      >
        <Badge badgeContent={myCart.length} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <Drawer 
        anchor="right" 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            bgcolor: 'background.default',
          }
        }}
      >
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