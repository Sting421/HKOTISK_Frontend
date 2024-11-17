/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import PropTypes from 'prop-types';
import axios from 'axios';

// Define custom theme colors
const theme = {
  primary: '#FFD700', // Gold
  secondary: '#800000', // Maroon
  background: '#FFFFFF', // White
  text: '#000000', // Black
};

const baseUrl = import.meta.env.VITE_BASE_URL;

// Styled components
const PriceChip = styled(Chip)(() => ({
  backgroundColor: theme.primary,
  color: theme.text,
  fontWeight: 'bold',
  fontSize: '1.2rem',
  padding: '1rem',
}));

const ActionButton = styled(Button)(() => ({
  backgroundColor: theme.secondary,
  color: theme.background,
  width: '100%',
  padding: '0.75rem',
  '&:hover': {
    backgroundColor: theme.primary,
    color: theme.text,
  },
}));

function MyItemCard({
  itemSize = [],
  price = [],
  productId,
  itemQuantity = 1,
  itemImage,
  itemName,
  itemDescription,
  myToken,
  setisUpated,
}) {
  const [size, setSize] = useState(itemSize?.[0] || 'S');
  const [priceValue, setPrice] = useState(price?.[0] || 0);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(myToken);
  const [open, setOpen] = useState(false);
  const [listQuantity, setListQuantity] = useState(
    Array.isArray(itemQuantity) && itemQuantity.length > 0 
      ? parseInt(itemQuantity[0]) 
      : typeof itemQuantity === 'number' 
        ? itemQuantity 
        : 1
  );

  useEffect(() => {
    setToken(myToken);
  }, [myToken]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setError('');
  };

  const addToCart = async () => {
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
      const response = await axios.post(`${baseUrl}/user/cart`, {
        productId: parseInt(productId, 10),
        quantity: quantity,
        price: parseFloat(priceValue),
        size: String(size),
      }, {
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

  return (
    <>
      <Card>
        <CardMedia
          component="img"
          image={itemImage}
          title={itemName}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'black', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {itemName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {itemDescription}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <PriceChip label={`₱${priceValue.toFixed(2)}`} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {Array.isArray(itemSize) && itemSize.length > 0 ? `Size: ${size} | ` : ''}
              Quantity: {listQuantity}
            </Typography>
          </Box>
          
          {Array.isArray(itemSize) && itemSize.length > 1 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: '500', fontSize: '0.875rem' }}>
                Size
              </Typography>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                {itemSize.map((s, index) => (
                  <Button
                    key={index}
                    variant={size === s ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => {
                      setSize(s);
                      setPrice(price?.[index] || 0);
                      setListQuantity(itemQuantity?.[index] || 0);
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          <Box>
            <ActionButton
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={addToCart}
            >
              Add to Cart
            </ActionButton>
          </Box>
        </CardContent>
      </Card>
      
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Added to Cart successfully
        </Alert>
      </Snackbar>
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

MyItemCard.propTypes = {
  itemSize: PropTypes.arrayOf(PropTypes.string),
  price: PropTypes.arrayOf(PropTypes.number),
  productId: PropTypes.number,
  itemQuantity: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  itemImage: PropTypes.string,
  itemName: PropTypes.string,
  itemDescription: PropTypes.string,
  myToken: PropTypes.string,
  setisUpated: PropTypes.func
};

export default MyItemCard;
