import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

function MyCartItemCard({  itemId, itemName, itemQuantity, itemPrice ,myToken}) {
  const [quantity, setQuantity] = useState(itemQuantity);
  const [size, setSize] = useState('Small');
  const [token, setToken] = useState(myToken);
  const [errorMessage, setErrorMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [cartData, setCartData] = useState({ id: itemId, quantity });

 
  const incrementQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      setCartData((prevData) => ({ ...prevData, quantity: (newQuantity + 1)  }));
      return newQuantity;
    });
    handleQuantityUpdate();
  };

  const decrementQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = Math.max(1, prev - 1);
      setCartData((prevData) => ({ ...prevData, quantity: newQuantity }));
      return newQuantity;
    });
    handleQuantityUpdate();
  };

  // Update cart quantity on the server
  const handleQuantityUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${baseUrl}/user/cart`,
        cartData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Quantity update successful:", response.data);

      if (response.data.token) {
        setToken(response.data.token);
        sessionStorage.setItem('token', JSON.stringify(response.data.token));
      }
    } catch (error) {
      setError('Quantity update failed. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (e) => {
    e.preventDefault();
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
      setErrorMessage('Failed to remove item. Please try again.');
    }
  };

  return (
    <Card 
      sx={{ 
        borderRadius: '4%', 
        width: '30rem', 
        backgroundColor: 'inherit', 
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', 
        maxHeight: '400px', 
        maxWidth: '500px', 
        minHeight: '200px', 
        minWidth: '100px' 
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {/* Other content can go here */}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{itemName}</Typography>
            <Typography color="#883C40">This is Item quantity: {itemQuantity}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '30px', marginLeft: "50px" }}>
              <IconButton size="small" onClick={decrementQuantity}>
                <RemoveCircleOutlineIcon fontSize="medium" />
              </IconButton>
              <Typography>{quantity}</Typography>
              <IconButton size="small" onClick={incrementQuantity}>
                <AddCircleOutlineRoundedIcon fontSize="medium" />
              </IconButton>
            </div>
            <Typography color="#883C40">Total Price: {(quantity * itemPrice).toFixed(2)}</Typography>
            <Button
              variant={'outlined'}
              size="small"
              sx={{
                borderRadius: '0% 25% 25% 25% / 54% 54% 0% 46%',
                backgroundColor: '#883C40',
                color: '#757575',
              }}
              onClick={handleRemoveItem}
            >
              Remove Item
            </Button>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          </Grid>
          <Grid item xs={6}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Grid item xs={6}>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '20px', marginLeft: '15px' }}>
                  <Typography variant="body2" style={{ fontWeight: '500', marginTop: '5px' }}>Size</Typography>
                  {['Small', 'Large'].map((option) => (
                    <Button
                      key={option}
                      variant={size === option ? 'contained' : 'outlined'}
                      size="small"
                      sx={{
                        borderRadius: '0% 25% 25% 25% / 54% 54% 0% 46%',
                        backgroundColor: size === option ? '#757575' : 'transparent',
                        color: size === option ? '#ffffff' : '#757575',
                        borderColor: '#757575',
                        '&:hover': {
                          backgroundColor: size === option ? '#616161' : 'rgba(117, 117, 117, 0.1)',
                          borderColor: size === option ? '#616161' : '#757575',
                        },
                      }}
                      onClick={() => setSize(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </Grid>
            </div>
            <Grid item xs={12}>
              {/* Additional content can go here */}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default MyCartItemCard;
