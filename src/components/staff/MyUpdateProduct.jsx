import { useState, useMemo, useCallback } from 'react';
import { Alert, Autocomplete, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, TextField, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;
const categoryOptions = [
  { label: 'Food' },
  { label: 'Beverage' },
];

const buttonStyles = {
  marginTop: '1rem',
  width: '2500px',
  backgroundColor: '#343434',
  '&:hover': {
    borderColor: '#36454F',
    color: '#fff',
    backgroundColor: '#36454F',
  },
};

function MyUpdateProduct({ productId, price, itemName, itemImage, itemDescription, itemSize, itemQuantity, myToken, setIsDeleted }) {
  const initialProductData = useMemo(() => ({
    productId: parseInt(productId, 10),
    description: itemDescription,
    productName: itemName,
    prices: price,
    quantity: itemQuantity,
    sizes: itemSize,
    category: 'Beverage',
    productImage: itemImage || null,
  }), [productId, itemDescription, itemName, price, itemQuantity, itemSize, itemImage]);

  const [productData, setProductData] = useState(initialProductData);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [delField, setDelField] = useState('');

  const handleProductChange = useCallback((e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePriceChange = (index, value) => {
    const updatedPrices = [...productData.prices];
    updatedPrices[index] = parseFloat(value);
    setProductData((prevData) => ({ ...prevData, prices: updatedPrices }));
  };

  const handleQuantityChange = (index, value) => {
    const updatedQuantities = [...productData.quantity];
    updatedQuantities[index] = parseInt(value, 10);
    setProductData((prevData) => ({ ...prevData, quantity: updatedQuantities }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { productId, description, productName, prices, quantity, sizes, category, productImage } = productData;

    const requestBody = {
      productId,
      description,
      productName,
      prices,
      quantity,
      sizes,
      category,
    };

    try {
      const response = await axios.put(`${baseUrl}/staff/product`, requestBody, {
        headers: { Authorization: `Bearer ${myToken}` },
      });
      console.log('Update successful:', response.data);
      console.log('Update price:', requestBody.prices);
      setOpen(true);
    } catch (error) {
      setError('Failed to update product. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${baseUrl}/staff/product?productId=${productData.productId}`, {
        headers: { Authorization: `Bearer ${myToken}` },
      });
      setOpen(true);
      setIsDeleted(true);
    } catch (error) {
      setError('Failed to delete product. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setError('');
  };

  const handleAgreeDelete = () => {
    if (delField === productData.productName) {
      handleDelete();
      handleDialogClose();
    } else {
      setError('Input mismatch. Please type the exact product name.');
    }
  };

  return (
    <Card sx={{ borderRadius: '8px', height: '790px', width: '400px', backgroundColor: 'inherit', boxShadow: 3, padding: 2 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <img
          src={productData.productImage || 'placeholder-image-url'}
          alt={productData.productName}
          style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
        />
        <TextField
          label="Product Name"
          name="productName"
          value={productData.productName}
          onChange={handleProductChange}
          fullWidth
          sx={{ marginBottom: '1rem' }}
        />
        <TextField
          id="description"
          name="description"
          label="Description"
          placeholder="Product description"
          value={productData.description}
          variant="outlined"
          fullWidth
          multiline
          rows={2}
          sx={{ marginBottom: '1.5rem' }}
          onChange={handleProductChange}
          required
        />
        <Autocomplete
          disablePortal
          options={categoryOptions}
          openOnFocus
          id="category"
          name="category"
          sx={{ width: '100%', marginBottom: '1.5rem' }}
          value={productData.category}
          disableCloseOnSelect
          onChange={handleProductChange}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />

        {productData.sizes.map((size, index) => (
          <Grid container spacing={2} key={size} sx={{ marginBottom: '1rem' }}>
            <Grid item xs={4}>
              <Typography  variant="body2" sx={{ fontWeight: 'bold', pointerEvents: 'none',}}>
                {size === 'S' ? 'Small' : size === 'M' ? 'Medium' : 'Large'}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Price"
                value={productData.prices[index]}
                onChange={(e) => handlePriceChange(index, e.target.value)}
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Quantity"
                value={productData.quantity[index]}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
            </Grid>
          </Grid>
        ))}

        <Box sx={{ flexGrow: 1 }} /> {/* Pushes the buttons to the bottom */}

        <div style={{display:'flex', flexDirection:"row", gap:'10px'}}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          sx={buttonStyles}
          disabled={isLoading}

        >
          Update Product
        </Button>
        <Button
            variant="outlined"
            onClick={() => {setOpenDialog(true); setError('');}}
            sx={{
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: '0.8',
                borderColor: '#8B0000',
                color: '#D2042D',
                '&:hover': {
                borderColor: '#D2042D',
                color: '#fff', // White text color when hovered
                backgroundColor: '#D2042D', // Fill color when hovered
                },
            }}
            fullWidth
            >
            <DeleteIcon />
        </Button>

        </div>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Type &quot;{productData.productName}&quot; to confirm deletion.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                fullWidth
                value={delField}
                onChange={(e) => setDelField(e.target.value)}
                error={!!error}
                helperText={error}
                sx={{
                    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'red',
                    },
                }}
                />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleAgreeDelete}>Delete</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
          <Alert onClose={() => setOpen(false)} severity="success">
            Action completed successfully!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}

export default MyUpdateProduct;
