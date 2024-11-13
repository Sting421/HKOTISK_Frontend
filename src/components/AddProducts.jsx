import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Autocomplete, Checkbox, FormControlLabel, TextField ,Grid, Grid2, InputAdornment} from '@mui/material';
import axios from 'axios';
import Logo from '../assets/componentsRes/hkotiskLogo.png';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AddProducts() {
  const [token, setToken] = useState();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({
    description: '',
    productName: '',
    prices: [0, 0, 0], // Default values for prices
    quantity: 1,
    sizes: [],
    category: '',
  });

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    if (savedToken) setToken(JSON.parse(savedToken));
    else console.log('No Data found');
  }, []);

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'sizes') {
      setProductData((prevData) => {
        const newSizes = checked
          ? [...prevData.sizes, value]
          : prevData.sizes.filter((size) => size !== value);
        return { ...prevData, sizes: newSizes };
      });
    } else if (name.startsWith('price')) {
      const sizeIndex = ['S', 'M', 'L'].indexOf(name.split('-')[1]); // Get index based on size (S, M, L)
      setProductData((prevData) => {
        const newPrices = [...prevData.prices];
        newPrices[sizeIndex] = parseFloat(value); // Update the price at the correct index
        return { ...prevData, prices: newPrices };
      });
    } else {
      setProductData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCategoryChange = (event, value) => {
    setProductData((prevData) => ({ ...prevData, category: value ? value.label : '' }));
  };

  const clearProductData = () => {
    setProductData({
      description: '',
      productName: '',
      prices: [0, 0, 0], // Reset prices to default
      quantity: 1,
      sizes: [],
      category: '',
    });
    setError(''); // Clear any existing errors
  };

  const categoryOptions = [
    { label: 'Food' },
    { label: 'Beverage' },
  ];

  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Authentication token is missing.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/staff/product`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      clearProductData();
      console.log('Product successfully Added:', response.data);
    } catch (error) {
      setError('Failed to add product. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <Card sx={{ marginLeft:'30%', marginTop:'7%', borderRadius: '2%', width: '30rem', backgroundColor: 'inherit', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', height: '700px', minWidth: '800px' }}>
      <h1 style={{ marginLeft: 30, marginTop: 30 }}>Add Product</h1>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <img
              src={Logo}
              alt="logo"
              style={{
                width: '13rem',
                height: '11rem',
                objectFit: 'cover',
                borderRadius: '0.375rem',
                border: '2px solid #000',
                backgroundColor: '#f0f0f0',
                padding: '8px',
              }}
            />
          </Grid>
          <Grid item xs={6}>
            
              <TextField
              id="product-name"
              name="productName"
              label="Product Name"
              variant="outlined"
              sx={{ width: 300, marginBottom: '16px' }}
              required
              onChange={handleProductChange}
            />
             <Typography>Size</Typography>
        <div>
          {['S', 'M', 'L'].map((size) => (
            <FormControlLabel
              key={size}
              control={
                <Checkbox
                  name="sizes"
                
                  value={size}
                  checked={productData.sizes.includes(size)}
                  onChange={handleProductChange}
                />
              }
              label={size}
            />
          ))}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {['S', 'M', 'L'].map((size, index) => (
            productData.sizes.includes(size) && (
              <TextField
                key={size}
                id={`price-${size}`}
                name={`price-${size}`}
                label={`Price (${size})`}
                variant="outlined"
                sx={{ width: 300, marginBottom: '16px', marginRight: '10px' }}
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₱</InputAdornment>, // Use InputProps here
                }}
                value={productData.prices[index] || ''}
                onChange={handleProductChange}
                required
              />
            )
          ))}
        </div>

          </Grid>
        </Grid>
          <TextField
        id="description"
        name="description"
        label="Description"
        placeholder="Product description"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        sx={{ marginBottom: '1.5rem', marginTop: '1rem' }}
        onChange={handleProductChange}
        required
      />

       
        
        <TextField
          id="quantity"
          name="quantity"
          label="Quantity"
          variant="outlined"
          required
          type="number"
          value={productData.quantity}
          onChange={handleProductChange}
          inputProps={{ min: 1 }}
          sx={{ width: 300, marginBottom: '16px' }}
        />
        <Autocomplete
          disablePortal
          options={categoryOptions}
          openOnFocus
          id="category"
          sx={{ width: 300 }}
          disableCloseOnSelect
          onChange={handleCategoryChange}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />

        {error && <Typography color="error">{error}</Typography>}
      </CardContent>
      <CardActions>
        <Button 
          variant="contained" 
          style={{ marginLeft: '37%' }} 
          onClick={handleAddItemSubmit} 
          disabled={isLoading} 
          aria-busy={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Product'}
        </Button>
      </CardActions>
    </Card>
  );
}
