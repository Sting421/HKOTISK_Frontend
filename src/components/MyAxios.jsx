import { useEffect, useState } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL; 

const useCart = () => {
  const [token,setToken] = useState('');

  const [products, setProducts] = useState([]);
  const [myCart, setMyCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {  
    const savedData = JSON.parse(sessionStorage.getItem('token'));
    if (savedData) {
      setToken(savedData);
    } else {
      console.log("No Data found");
    }
  }, []);

  // Function to add item to cart
  const addToCart = async (itemData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/user/addToCart`,
        itemData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Added to Cart successfully:", response.data);
      setSuccessMessage('Item added to cart successfully!');
      fetchCart(); // Refresh the cart
    } catch (error) {
      setError('Failed to add to cart. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setMyCart(response.data.oblist); // Set the products state with the oblist
      }
    } catch (error) {
      console.error('Error fetching Cart:', error);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/product`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setProducts(response.data.oblist); // Set the products state with the oblist
      } else {
        console.error('Error fetching products:', response.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // useEffect for fetching cart and products
  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, [token]); // Runs on token change

  // Return the necessary data and functions
  return {
    products,
    myCart,
    isLoading,
    error,
    successMessage,
    addToCart,
    fetchCart,
    fetchProducts,
  };
};

export default useCart;
