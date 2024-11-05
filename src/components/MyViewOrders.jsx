import { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL; 

function MyViewOrders() {
    
    const [token, setToken] = useState();

    const [orderList, setOrderList] = useState([]);

    
    useEffect(() => {
        const savedToken = sessionStorage.getItem('token');
        if (savedToken) setToken(JSON.parse(savedToken));
        else console.log("No Data found");
    
    }, []);
    

    useEffect(() => {
      const fetchOrders = async () => {
          try {
              const response = await axios.get(`${baseUrl}/staff/orders`, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              console.log("CheckOut successful:", response.data);
              setOrderList(response.data.orderlist);
          } catch (err) {
             
              console.error(err);
          }
      };

      fetchOrders(); 
  }, [baseUrl, token]); 

    return (
        <>
         <div>
            <h1>Order List</h1>
            {orderList.length > 0 ? (
                <ul>
                    {orderList.map(order => (
                        <li key={order.orderId}>
                            <h2>Order ID: {order.orderId}</h2>
                            <p>Ordered By: {order.orderBy}</p>
                            <p>Status: {order.orderStatus}</p>
                            {order.products.length > 0 ? (
                                <ul>
                                    {order.products.map(product => (
                                        <li key={product.cartId}>
                                            <p>Product Name: {product.productName}</p>
                                            <p>Category: {product.productCategory}</p>
                                            <p>Quantity: {product.quantity}</p>
                                            <p>Price: ${product.price.toFixed(2)}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No products in this order.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
       </>
    );
    }

    export default MyViewOrders;