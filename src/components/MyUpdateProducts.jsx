/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from 'react';
import { Alert, Button, Card, CardContent, Grid, IconButton, InputAdornment, Snackbar, TextareaAutosize, TextField, Typography } from '@mui/material';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const sizeOptions = ['S','M', 'L'];

function MyUpdateProducts({ productId, price, itemName, itemImage, itemDescription, itemSize, itemQuantity,myToken,isUpdated}) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('S');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(myToken);
  const [productData, setProductData] = useState(
    { productId: parseInt(productId,10), description: itemDescription, productName: itemName, price: parseFloat(price) ,quantity:itemQuantity, sizes : itemSize});

  const [open, setOpen] = useState(false);



  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };
  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const itemIdInt = parseInt(productData.productId, 10);
      const response = await axios.delete(`${baseUrl}/staff/product?productId=${itemIdInt}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setOpen(true);
    } catch (error) {
      setError('Failed to add to cart. Please try again.');
     
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!token) {
      setError('You must be logged in to add items to the cart.');
      setIsLoading(false);
      return;
    }

    const requestBody = {
     
        productId: parseInt(productData.productId,10),
        description: productData.description,
        productName: productData.productName,
        price: parseFloat(productData.price),
        quantity: productData.quantity,
        category: "Food",
        sizes:productData.sizes
      };

    try {
      const response = await axios.put(
        `${baseUrl}/staff/product`,
        requestBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Update successfully:", response.data);
      console.log(requestBody);
      setOpen(true);
    } catch (error) {
      setError('Failed to add to cart. Please try again.');
      console.log(requestBody)
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
          <TextField
                InputProps={{
                    startAdornment: <InputAdornment position="start">Name:</InputAdornment>
                }}
                       hiddenLabel
                        id="outlined-size-small"
                        defaultValue={productData.productName} 
                        name='productName'
                        onChange={handleProductChange}
                        size="small"
                        sx={{ width: '200px' }}
                        />
        
             <TextField
                    InputProps={{
                        startAdornment: <InputAdornment position="start">Price:</InputAdornment>
                    }}
                    hiddenLabel
                    id="outlined-size-small"
                    name="price"
                    defaultValue={productData.price}
                    onChange={handleProductChange}
                    size="small"
                    sx={{ width: '130px' }}
                />
          
          <div>
          <TextareaAutosize
            id="outlined-size-small"
            name="description"
      
            defaultValue={productData.description}
            onChange={handleProductChange}
            rows={4}
            cols={36}
            sx={{ fontFamily: "'IBM Plex Sans', sans-serif" }} 
          />
          </div>
           
            <TextField
             InputProps={{
                startAdornment: <InputAdornment position="start">Quantity:</InputAdornment>
            }}
                hiddenLabel
                id="outlined-size-small"
                name='quantity'
                defaultValue={productData.quantity}
                onChange={handleProductChange}
                size="small"
                sx={{ width: '130px' }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '30px', marginLeft: "50px" }}>
             
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
                  onClick={handleUpdate}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  sx={{ borderRadius: '10% 10% 10% 10% / 50% 50% 50% 50%', backgroundColor: '#883C40', '&:hover': { backgroundColor: '#6f2b2f' }, paddingLeft: '40px', paddingRight: '40px' }}
                  onClick={handleDelete}
                >
                  Remove
                </Button>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                  <Alert  onClose={handleClose}  severity="success" variant="filled"  sx={{ width: '100%' }} >
                    Product Updated
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

export default MyUpdateProducts;
