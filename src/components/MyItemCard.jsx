/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from 'react';
import { Alert, Button, Card, CardContent, Grid, IconButton, Snackbar, Typography } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const sizeOptions = ['S','M', 'L'];

function MyItemCard({ productId, price, itemName, itemImage, itemDescription, itemSize, itemQuantity }) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('S');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  const [open, setOpen] = useState(false);

  const itemData = useMemo(() => ({
    productId: parseInt(productId, 10),
    quantity,
    price: parseFloat(price),
    size:String(size), 
  }), [productId,size, quantity, price]);

  useEffect(() => {
    const savedData = sessionStorage.getItem('token');
    if (savedData) {
      setToken(JSON.parse(savedData));
    } else {
      console.log("No Data found");
    }
  }, []);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  
  const decrementQuantity = () => {setQuantity((prev) => Math.max(1, prev - 1))};

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!token) {
      setError('You must be logged in to add items to the cart.');
      setIsLoading(false);
      return;
    }

    try {
      console.log(itemData.productId);
      console.log(itemData.quantity);
      console.log(itemData.price);
      console.log(itemData.size);
      const response = await axios.post(
        `${baseUrl}/user/addToCart`,
        itemData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Added to Cart successfully:", response.data);

      setOpen(true);
    } catch (error) {
      setError('Failed to add to cart. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  return (
    <Card sx={{ borderRadius: '4%', width: '30rem', backgroundColor: 'inherit', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', maxHeight: '400px', maxWidth: '600px', minHeight: '300px', minWidth: '600px' }}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <img
              src={`${itemImage}?height=60&width=60`}
              alt={itemName}
              style={{ width: '13rem', height: '11rem', objectFit: 'cover', borderRadius: '0.375rem' }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{itemName}</Typography>
            <Typography color="#883C40">P{price.toFixed(2)}</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: '0.5rem' }}>
              {itemDescription}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: '0.5rem' }}>
              Available: {itemQuantity}
            </Typography>
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
          </Grid>
          <Grid item xs={6}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Grid item xs={6}>
                {itemSize != null && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '20px', marginLeft: '15px' }}>
                    <Typography variant="body2" style={{ fontWeight: '500', marginTop: '5px' }}>Size</Typography>
                    {sizeOptions.map(option => (
                      <Button
                        key={option}
                        variant={size === option ? 'contained' : 'outlined'}
                        size="small"
                        sx={{
                          borderRadius: '0% 25% 25% 25% / 54% 54% 0% 46%',
                          backgroundColor: size === option ? '#757575' : 'transparent',
                          color: size === option ? '#ffffff' : '#757575',
                          paddingRight: '30px',
                          paddingLeft: '30px',
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
                )}
              </Grid>
            </div>
            <Grid item xs={12}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '10px', marginTop: '9px' }}>
                <Button
                  variant="contained"
                  sx={{ borderRadius: '10% 10% 10% 10% / 50% 50% 50% 50%', backgroundColor: '#883C40', '&:hover': { backgroundColor: '#6f2b2f' }, paddingLeft: '40px', paddingRight: '40px' }}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                  <Alert  onClose={handleClose}  severity="success" variant="filled"  sx={{ width: '100%' }} >
                    Added to Cart successfully
                  </Alert>
                </Snackbar>
              </div>
            </Grid>
          </Grid>
        </Grid>
        {error && <Typography color="error">{error}</Typography>}
      </CardContent>
    </Card>
  );
}

export default MyItemCard;
