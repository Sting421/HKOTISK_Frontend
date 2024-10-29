import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL; 

function MyItemCard({ productId, price, itemName, itemImage, itemDescription, itemSize ,itemQuantity }) {
  const [quantity, setQuantity] = useState(1);
  const [currSize, setCurrSize] = useState('SMALL');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [itemData, setItemData] = useState({
    productId: parseInt(productId, 10),
    quantity: 1,
    price: parseFloat(price)           
  });

  const incrementQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      setItemData((prevItemData) => ({
        ...prevItemData,
        quantity: newQuantity,
      }));
      return newQuantity;
    });
  };

  const decrementQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = Math.max(1, prev - 1);
      setItemData((prevItemData) => ({
        ...prevItemData,
        quantity: newQuantity,
      }));
      return newQuantity;
    });
  };

  useEffect(() => {
    const savedData = JSON.parse(sessionStorage.getItem('token'));
    if (savedData) {
      setToken(savedData);
    } else {
      console.log("No Data found");
    }
  }, []);

  useEffect(() => {
    setItemData((prevItemData) => ({
      ...prevItemData,
      quantity: quantity,
    }));
  }, [quantity]);

  const handleAddtoCart = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!token) {
      setError('You must be logged in to add items to the cart.');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(
        `${baseUrl}/user/addToCart`, 
        itemData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Added to Cart successfully:", response.data);
    } catch (error) {
      setError('Failed to add to cart. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={{ borderRadius:'4%', width: '30rem', backgroundColor: 'inherit', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', maxHeight:'400px', maxWidth:'500px', minHeight:'300px', minWidth:'500px'}}>
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
            <Typography color="#883C40">P{price}</Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
              {itemDescription}
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
              Available: {itemQuantity} 
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop:'30px', marginLeft:"50px"}}>
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
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop:'20px', marginLeft:'15px' }}>
                    <Typography variant="body2" style={{ fontWeight: '500', marginTop:'5px'}}>Size</Typography>
                    {['Small', 'Large'].map((option) => (
                      <Button
                        key={option}
                        variant={currSize === option ? 'contained' : 'outlined'}
                        size="small"
                        sx={{
                          borderRadius: '0% 25% 25% 25% / 54% 54% 0% 46%',
                          backgroundColor: currSize === option ? '#757575' : 'transparent', 
                          color: currSize === option ? '#ffffff' : '#757575',
                          borderColor: '#757575', 
                          '&:hover': {
                            backgroundColor: currSize === option ? '#616161' : 'rgba(117, 117, 117, 0.1)', 
                            borderColor: currSize === option ? '#616161' : '#757575', 
                          },
                        }}
                        onClick={() => setCurrSize(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                 )}
                  
              </Grid>
            </div>
            <Grid item xs={12}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft:'10px', marginTop:'9px'}}>
                <Button 
                  variant="contained" 
                  sx={{ borderRadius:'10% 10% 10% 10% / 50% 50% 50% 50%', backgroundColor: '#883C40', '&:hover': { backgroundColor: '#6f2b2f' }, paddingLeft:'40px', paddingRight:'40px' }}
                  onClick={handleAddtoCart}>
                  Add to Cart
                </Button>
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
