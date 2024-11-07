/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
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
        price: 0.0,       
        quantity: 1,      
        sizes: [],
        category: '',
    });

    useEffect(() => {
        const savedToken = sessionStorage.getItem('token');
        if (savedToken) setToken(JSON.parse(savedToken));
        else console.log("No Data found");
      
      }, []);
    

    const handleProductChange = (e) => {
      
        const { name, value, type, checked } = e.target;

        if (name === 'sizes') {
            // Handle sizes as an array
            setProductData((prevData) => {
                const newSizes = checked
                    ? [...prevData.sizes, value]
                    : prevData.sizes.filter((size) => size !== value);
                return { ...prevData, sizes: newSizes };
            });
        } else {
            // Update other fields normally
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
          price: 0,
          quantity: 0,
          sizes: ''
        });
      };

    const categoryOptions = [
        { label: 'Food' },
        { label: 'Beverage' },
        // Add more categories as needed
    ];

    const handleAddItemSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        console.log('Request Body:', productData);
       
        try {
            const response = await axios.post(
                `${baseUrl}/staff/product`,
                productData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            clearProductData();
            console.log("Product successfully Added:", response.data);
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
                        <TextField
                            id="price"
                            name="price"
                            label="Price"
                            variant="outlined"
                            sx={{ width: 300 }}
                            style={{ marginBottom: '16px' }}
                            inputProps={{ min: 0 }}
                            onChange={handleProductChange}
                            required
                        />
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
                                            onChange={handleProductChange}
                                        />
                                    }
                                    label={size} // Label for the checkbox
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
                    {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
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
