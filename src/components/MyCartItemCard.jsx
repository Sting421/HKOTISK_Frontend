import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

const baseUrl = import.meta.env.VITE_BASE_URL;

function MyCartItemCard(props) {
  const [quantity, setQuantity] = useState(props.itemQuantity);
  const [size, setSize] = useState(props.itemSize);
  const [token, setToken] = useState(props.myToken);
  const [errorMessage, setErrorMessage] = useState('');
  const [productSize, setProductSize] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [cartData, setCartData] = useState({ id: props.itemId, quantity,productSize});

 
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
  if(isLoading){
    <LoadingSpinner/>
  }

  // Update cart quantity on the server
  const handleQuantityUpdate = async () => {
    setIsLoading(true);
    console.log("This is size: ",productSize);
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
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSizeChange = (event) => {
    
    setSize(event.target.value); 
    setProductSize(event.target.value); 
    handleQuantityUpdate();

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
          <Typography variant="h6">{props.itemName}</Typography>
          <Typography variant="h6">₱ {props.itemPrice.toFixed(2)}</Typography>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
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

          <div>
          <FormControl size="small">
              <InputLabel>Size</InputLabel>
              <Select
                label="Size"
                value={size}  // Use the local state for size
                onChange={handleSizeChange}
                sx={{ minWidth: 90 }}
              >
                <MenuItem value='S'>Small</MenuItem>
                <MenuItem value='M'>Medium</MenuItem>
                <MenuItem value='L'>Large</MenuItem>
              </Select>
            </FormControl>

          </div>
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
  itemId:PropTypes.number.isRequired,
  itemName: PropTypes.string.isRequired,
  itemQuantity: PropTypes.number,
  itemSize: PropTypes.string,
  setIsDeleted: PropTypes.func,
  itemPrice:PropTypes.number.isRequired,
  myToken:PropTypes.string.isRequired
};

