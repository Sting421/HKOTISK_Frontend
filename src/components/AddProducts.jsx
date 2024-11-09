import  { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Autocomplete, Checkbox, FormControlLabel, TextField } from '@mui/material';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AddProducts() {
  const [token, setToken] = useState();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({
    description: '',
    productName: '',
    prices: [], // Prices will be an array
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
      productId: 0,
      description: '',
      productName: '',
      prices: [],  // Reset prices
      quantity: 0,
      sizes: [],
      category: '',
    });
  };

  const categoryOptions = [
    { label: 'Food' },
    { label: 'Beverage' },
  ];

  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
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
    <Card sx={{ maxWidth: 700 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <TextField
              id="product-name"
              name="productName"
              label="Product Name"
              variant="outlined"
              sx={{ width: 300 }}
              style={{ marginBottom: '16px' }}
              required
              onChange={handleProductChange}
            />
            {productData.sizes.includes('S') && (
              <TextField
                id="price-S"
                name="price-S"
                label="Price (S)"
                variant="outlined"
                sx={{ width: 300 }}
                style={{ marginBottom: '16px' }}
                inputProps={{ min: 0 }}
                value={productData.prices[0] || ''}
                onChange={handleProductChange}
                required
              />
            )}
            {productData.sizes.includes('M') && (
              <TextField
                id="price-M"
                name="price-M"
                label="Price (M)"
                variant="outlined"
                sx={{ width: 300 }}
                style={{ marginBottom: '16px' }}
                inputProps={{ min: 0 }}
                value={productData.prices[1] || ''}
                onChange={handleProductChange}
                required
              />
            )}
            {productData.sizes.includes('L') && (
              <TextField
                id="price-L"
                name="price-L"
                label="Price (L)"
                variant="outlined"
                sx={{ width: 300 }}
                style={{ marginBottom: '16px' }}
                inputProps={{ min: 0 }}
                value={productData.prices[2] || ''}
                onChange={handleProductChange}
                required
              />
            )}
            <TextField
              id="quantity"
              name="quantity"
              label="Quantity"
              variant="outlined"
              style={{ marginBottom: '16px' }}
              required
              value={productData.quantity}
              onChange={handleProductChange}
              inputProps={{ min: 0 }}
              sx={{ width: 300 }}
            />
            <TextField
              id="description"
              name="description"
              label="Description"
              variant="outlined"
              sx={{ width: 300 }}
              style={{ marginBottom: '16px' }}
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
          </div>
          {error && <Typography color="error">{error}</Typography>}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" style={{ marginLeft: '37%' }} onClick={handleAddItemSubmit} disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Product'}
        </Button>
      </CardActions>
    </Card>
  );
}
