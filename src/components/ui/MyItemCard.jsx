/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert, Button, Card, CardContent, Divider, Grid, IconButton, Snackbar, Typography } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Label } from '@mui/icons-material';

const baseUrl = import.meta.env.VITE_BASE_URL;

function MyItemCard({
  itemSize = ['S'],
  price = [0],
  productId,
  itemQuantity = 1,
  itemImage,
  itemName,
  itemDescription,
  myToken,
  setisUpated,
}) {
  const [size, setSize] = useState(itemSize[0] || 'S');
  const [priceValue, setPrice] = useState(parseFloat(price[0]) || 0);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(myToken);
  const [open, setOpen] = useState(false);
  const [listQuantity, setListQuantity] = useState(parseInt(itemQuantity[0]) || 0);

  useEffect(() => {
    setToken(myToken);
  }, [myToken]);

  const itemData = useMemo(
    () => ({
      productId: parseInt(productId, 10),
      quantity: quantity,
      price: parseFloat(priceValue),
      size: String(size),
    }),
    [productId, size, quantity, priceValue]
  );

  // const incrementQuantity = useCallback(() => {
  //   setQuantity((prev) => {
  //     if (itemQuantity > 1 && prev < itemQuantity) {
  //       setisUpated(true);
  //       return prev + 1;
  //     }
  //     return prev;
  //   });
  //   setError('');
  // }, [itemQuantity,setisUpated]);

  // const decrementQuantity = useCallback(() => {
  //   setQuantity((prev) => Math.max(1, prev - 1));
  // }, []);

  const incrementQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      setQuantity((prevData) => ({ ...prevData, quantity: newQuantity }));
      return newQuantity;
    });
   
  };

  const decrementQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = Math.max(1, prev - 1);
      setQuantity((prevData) => ({ ...prevData, quantity: newQuantity }));
      return newQuantity;
    });
   
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!token) {
      setError('You must be logged in to add items to the cart.');
      setIsLoading(false);
      return;
    }

    if (!size) {
      setError('Please select a size.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/user/cart`, itemData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Added to Cart successfully:', response.data);
      setOpen(true);
      setQuantity(1);
    } catch (error) {
      setError('Failed to add to cart. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setError('');
  };

  useEffect(() => {
    if (itemSize.length === 1) setSize(itemSize[0]);
    if (price.length === 1) setPrice(parseFloat(price[0]));
  }, [itemSize, price]);

  return (
    <Card
    sx={{
      marginLeft: '12px',
      borderRadius: '0.5rem',
      width: '30rem',
      backgroundColor: 'inherit',
      boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      height: '33rem', 
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '0' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={`${itemImage}?height=400&width=400`}
          alt={itemName}
          style={{ width: '100%', height: '200px', padding:'50px' }}
        />
      </div>
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <Typography variant="h6" sx={{ fontWeight: '600' }}>
              {itemName}
            </Typography>
            <Typography variant="body2" color="textSecondary" fontSize={"25px"}>
            ₱{priceValue.toFixed(2)}
            </Typography>
          </div>
          <Typography
            variant="caption"
            sx={{
              backgroundColor: 'rgba(117, 117, 117, 0.1)',
              color: '#757575',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
            }}
          >
            Available: {listQuantity}
          </Typography>
        </div>
        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '1rem' }}>
          {itemDescription}
        </Typography>
  
        {itemSize.length > 1 && (
          <div>
            <Typography variant="body2" sx={{ marginBottom: '0.5rem', fontWeight: '500' }}>
              Size
            </Typography>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {itemSize.map((option, idx) => (
                <Button
                  key={option}
                  variant={size === option ? 'contained' : 'outlined'}
                  size="small"
                  sx={{
                    borderRadius: '0.25rem',
                    backgroundColor: size === option ? '#757575' : 'transparent',
                    color: size === option ? '#ffffff' : '#757575',
                    borderColor: '#AD7575',
                    '&:hover': {
                      backgroundColor: size === option ? '#616161' : 'rgba(117, 117, 117, 0.1)',
                    },
                  }}
                  onClick={() => {
                    setSize(option);
                    setPrice(parseFloat(price[idx]));
                    setListQuantity(parseInt(itemQuantity[idx]));
                    setError('');
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ flexGrow: 1 }}></div>
      <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <IconButton size="small" onClick={decrementQuantity}>
            <RemoveCircleOutlineIcon fontSize="medium" />
          </IconButton>
          <Typography>{quantity}</Typography>
          <IconButton size="small" onClick={incrementQuantity}>
            <AddCircleOutlineRoundedIcon fontSize="medium" />
          </IconButton>
        </div>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#8B4543',
            '&:hover': { backgroundColor: '#693432' },
            flex: '1',
          }}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
            Added to Cart successfully
          </Alert>
        </Snackbar>
        <Snackbar open={Boolean(error)} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </div>
    </CardContent>
  </Card>
  );
}

MyItemCard.propTypes = {
  itemSize: PropTypes.arrayOf(PropTypes.string),
  price: PropTypes.arrayOf(PropTypes.number),
  productId: PropTypes.number.isRequired,
  itemQuantity: PropTypes.arrayOf(PropTypes.number),
  itemImage: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
  itemDescription: PropTypes.string,
  myToken: PropTypes.string,
  setisUpated: PropTypes.func,
};

export default MyItemCard;
