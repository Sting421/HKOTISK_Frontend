import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Autocomplete, Checkbox, FormControlLabel, TextField ,Grid, InputAdornment} from '@mui/material';
import axios from 'axios';
import Logo from './res/hkotiskLogo.png';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AddProducts() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [hovered, setHovered] = useState(false);

  const [token, setToken] = useState();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({
    description: '',
    productName: '',
    prices: [0, 0, 0], 
    quantity: [],
    sizes: [],
    category: '',
    productImage: null,
  });

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    if (savedToken) setToken(JSON.parse(savedToken));
    else console.log('No Data found');
  }, []);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setSelectedImage(file);

          const reader = new FileReader();
          reader.onload = () => setPreview(reader.result);
          reader.readAsDataURL(file);
          console.log(file);
        }
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedImage) return;

      const formData = new FormData();
      formData.append('image', selectedImage);

      try {
          const response = await fetch('/api/upload-image', {
              method: 'POST',
              body: formData,
          });
          const result = await response.json();
          console.log(result);
          
      } catch (error) {
          console.error('Error uploading image:', error);
          console.log('this is image:',formData)
      }
    };


  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'sizes') {
      setProductData((prevData) => {
        const newSizes = checked
          ? [...prevData.sizes, value]
          : prevData.sizes.filter((size) => size !== value);
        return { ...prevData, sizes: newSizes };
      });
    }
    else if (name.startsWith('quantity')) {
      const sizeIndex = ['S', 'M', 'L'].indexOf(name.split('-')[1]); // Get index based on size (S, M, L)
      setProductData((prevData) => {
        const newQuantity = [...prevData.quantity];
        newQuantity[sizeIndex] = parseFloat(value); // Update the quantity at the correct index
        return { ...prevData, quantity: newQuantity };
      });
    }
     else if (name.startsWith('price')) {
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
      quantity: [],
      sizes: [],
      category: '',
    });
    setError('');// Clear any existing errors
   
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
    
    <Card sx={{  marginTop:'3%', borderRadius: '2%', width: '30rem', backgroundColor: 'inherit', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', minHeight: '420px', minWidth: '800px' }}>
      <h1 style={{ marginLeft: 30, marginTop: 30 }}>Add Product</h1>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
        <div style={{ position: 'relative', width: '20rem', height: '11rem',}}>
     
          <img
            src={preview || Logo}
            alt="logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '0.375rem',
              backgroundColor: '#f0f0f0',
            }}
          />
          <label
              htmlFor="upload-image"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                padding: '2.3rem 8.4rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
                textAlign: 'center',
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <FileUploadIcon style={{ fontSize: '3rem' }} />
              Upload Image
            </label>
          <input
            id="upload-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>
          </Grid>
          
          <Grid item xs={6}>
            
              <TextField
              id="product-name"
              name="productName"
              label="Product Name"
              variant="outlined"
              value={productData.productName}
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
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {['S', 'M', 'L'].map((size, index) => (
              productData.sizes.includes(size) && (
                <div 
                  key={size} 
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '16px' }}
                >
                  <TextField
                    id={`price-${size}`}
                    name={`price-${size}`}
                    label={`Price (${size})`}
                    variant="outlined"
                    sx={{ width: 170, marginRight: '10px' }}
                    inputProps={{ min: 0 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                    }}
                    value={productData.prices[index] || ''}
                    onChange={handleProductChange}
                    required
                  />
                  <TextField
                    id={`quantity-${size}`}
                    name={`quantity-${size}`}
                    label={`Quantity (${size})`}
                    variant="outlined"
                    sx={{ width: 110, marginRight: '10px' }}
                    inputProps={{ min: 0 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">#</InputAdornment>,
                    }}
                    value={productData.quantity[index] || ''}
                    onChange={handleProductChange}
                    required
                  />
                </div>
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
              value={productData.description}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              sx={{ marginBottom: '1.5rem', marginTop: '1rem' }}
              onChange={handleProductChange}
              required
            />
        
        <Autocomplete
          disablePortal
          options={categoryOptions}
          openOnFocus
          id="category"
          sx={{ width: 300 }}
          value={productData.category}
          disableCloseOnSelect
          onChange={handleCategoryChange}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />

        {error && <Typography color="error">{error}</Typography>}
      </CardContent>
      <CardActions>
      <Button 
          variant="contained" 
          sx={{ 
            marginLeft: '80%', 
            backgroundColor: 'black', 
            color: 'white',
            '&:hover': {
              backgroundColor: '#36454F',
            },
          }} 
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
