import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  FormControl,
  InputLabel
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import PropTypes from 'prop-types';

const baseUrl = import.meta.env.VITE_BASE_URL;

function MyCartItemCard(props) {
  const [quantity, setQuantity] = useState(props.itemQuantity);
  const [productSize, setProductSize] = useState(props.itemSize);
  const [price, setPrice] = useState(props.itemPrice);
  const [token, setToken] = useState(props.myToken);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [cartData, setCartData] = useState({ 
    id: props.itemId, 
    quantity, 
    size: productSize,
    price: price 
  });
  
  const updateCartData = async (newQuantity) => {
    try {
      setIsLoading(true);
      const updatedCartData = { 
        ...cartData, 
        quantity: newQuantity 
      };
      
      const response = await axios.put(
        `${baseUrl}/user/cart`,
        updatedCartData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Update successful:", response.data);
      if (response.data.token) {
        setToken(response.data.token);
        sessionStorage.setItem('token', JSON.stringify(response.data.token));
      }
      
      setQuantity(newQuantity);
      setCartData(updatedCartData);
      props.setIsUpdated(true);
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (!isLoading) {
      const newQuantity = quantity + 1;
      updateCartData(newQuantity);
    }
  };

  const decrementQuantity = () => {
    if (!isLoading && quantity > 1) {
      const newQuantity = quantity - 1;
      updateCartData(newQuantity);
    }
  };

  const handleRemoveItem = async (e) => {
    e.preventDefault();
    try {
      const itemIdInt = parseInt(props.itemId, 10);
      const response = await axios.delete(`${baseUrl}/user/cart?cartId=${itemIdInt}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      props.setIsDeleted(true);
      console.log("Item removed from cart successfully:", response.data);
    } catch (error) {
      console.error('Error Removing Item:', error);
      setErrorMessage('Failed to remove item. Please try again.');
    }
  };

  return (
    <Card sx={{ width: '100%', maxWidth: 390 }}>
      <CardContent sx={{ p: 3 }}>
      
      
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flex: 1, mr: 2 }}>{props.itemName}</Typography>
          <Typography variant="h6">₱ {(price * quantity).toFixed(2)}</Typography>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <div>
            <Typography variant="body2" color="text.secondary">Quantity:</Typography>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
              <IconButton onClick={decrementQuantity} aria-label="Decrease quantity" size="small">
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2" sx={{ width: 40, textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton onClick={incrementQuantity} aria-label="Increase quantity" size="small">
                <AddIcon fontSize="small" />
              </IconButton>
            </div>
          </div>

          {productSize && productSize !== "NULL" && (
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Size:</Typography>
              <Typography variant="body1">
                {productSize}
              </Typography>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <Button
            variant="text"
            color="error"
            sx={{ fontSize: '0.875rem', textTransform: 'none' }}
            onClick={handleRemoveItem}
          >
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default MyCartItemCard;

MyCartItemCard.propTypes = {
  itemId: PropTypes.number.isRequired,
  itemName: PropTypes.string.isRequired,
  itemQuantity: PropTypes.number,
  itemSize: PropTypes.string,
  setIsDeleted: PropTypes.func,
  setIsUpdated: PropTypes.func,
  itemPrice: PropTypes.number.isRequired,
  productId: PropTypes.number.isRequired,
  myToken: PropTypes.string.isRequired
};
