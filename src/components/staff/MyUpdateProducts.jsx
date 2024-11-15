/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Alert, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, InputAdornment, Snackbar, TextareaAutosize, TextField, Typography } from '@mui/material';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const sizeOptions = ['S', 'M', 'L'];

function MyUpdateProducts({ productId, price, itemName, itemImage, itemDescription, itemSize, itemQuantity, myToken,setIsDeleted }) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('S');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(myToken);
  const [productData, setProductData] = useState(
    { productId: parseInt(productId, 10), description: itemDescription, productName: itemName, prices: parseFloat(price), quantity: itemQuantity, sizes: itemSize });

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [delFeild, setDelFeild] = useState('');

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleDelete = async (e) => {
    try {
      const itemIdInt = parseInt(productData.productId, 10);
      const response = await axios.delete(`${baseUrl}/staff/product?productId=${itemIdInt}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setOpen(true);
      setIsDeleted(true);
    } catch (error) {
      setError('Failed to delete product. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!token) {
      setError('You must be logged in to update the product.');
      setIsLoading(false);
      return;
    }

    const requestBody = {
      productId: parseInt(productData.productId, 10),
      description: productData.description,
      productName: productData.productName,
      prices: [parseFloat(productData.price)],
      quantity: productData.quantity,
      category: "Food",
      sizes: productData.sizes
    };

    try {
      const response = await axios.put(
        `${baseUrl}/staff/product`,
        requestBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Update successfully:", response.data);
      setOpen(true);
    } catch (error) {
      setError('Failed to update product. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDialog(false);
    setError('');
  };

  const handleAgreeDelete = () => {
    if (delFeild === itemName) {
      handleDelete();
      setError('');
      setOpenDialog(false);
    } else {
      setError('Input mismatch, Please input the item name');
    }
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
              defaultValue={productData.prices}
              onChange={handleProductChange}
              size="small"
              sx={{ width: '130px' }}
            />
            <TextareaAutosize
              id="outlined-size-small"
              name="description"
              defaultValue={productData.description}
              onChange={handleProductChange}
              rows={4}
              cols={36}
              sx={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            />
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
            {itemSize != null && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '20px', marginLeft: '15px' }}>
                <Typography variant="body2" style={{ fontWeight: '500', marginTop: '5px' }}>Size</Typography>
                {itemSize.map((option, idx) => (
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
                    onClick={() => { 
                      setSize(option); 
                      setError(''); 
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              sx={{ borderRadius: '10% 10% 10% 10% / 50% 50% 50% 50%', backgroundColor: '#883C40', '&:hover': { backgroundColor: '#6f2b2f' }, paddingLeft: '40px', paddingRight: '40px' }}
              onClick={handleUpdate}
            >
              Update
            </Button>
            <Button
              variant="outlined"
              sx={{ marginTop: '10px' }}
              onClick={handleClickOpen}
            >
              Remove
            </Button>
            <Dialog 
              open={openDialog} 
              onClose={handleCloseDelete} 
              aria-labelledby="dialog-title"
              aria-describedby="dialog-description"
            >
              <DialogTitle id="dialog-title">Delete Item</DialogTitle>
              <DialogContent>
                <DialogContentText id="dialog-description">
                  Are you sure you want to delete item {itemName}?<br /> To confirm, type &quot;{itemName}&quot; in the box below.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="delFeild"
                  label="Confirm Delete"
                  fullWidth
                  variant="standard"
                  value={delFeild}
                  onChange={(e) => {
                    setDelFeild(e.target.value);
                    setError('');
                }}
                />
                <p style={{color:"red"}}>{error}</p>
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={handleCloseDelete}
                  tabIndex={openDialog ? 0 : -1}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAgreeDelete}
                  tabIndex={openDialog ? 0 : -1}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </CardContent>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Product updated successfully!
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default MyUpdateProducts;
