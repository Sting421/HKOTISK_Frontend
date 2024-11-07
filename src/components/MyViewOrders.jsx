import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, Checkbox, Card, CardContent, CardActions, Typography, Badge, Box, CircularProgress, Divider } from '@mui/material';
import { AccessTime } from '@mui/icons-material';


const baseUrl = import.meta.env.VITE_BASE_URL; 

function MyViewOrders(props) {
    
    const [token] = useState(props.token);

    const [orderList, setOrderList] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [checkedItems, setCheckedItems] = useState({});

    const isAllChecked = (orderId, products) => {
      return products.every(product => checkedItems[orderId]?.[product.cartId]);
    };

    const handleCheckboxChange = (orderId, cartId) => {
      setCheckedItems(prevState => ({
        ...prevState,
        [orderId]: {
          ...prevState[orderId],
          [cartId]: !prevState[orderId]?.[cartId]
        }
      }));
    };

    useEffect(() => {
      setIsLoading(true);
      const fetchOrders = async () => {
          try {
              if(token){
                const response = await axios.get(`${baseUrl}/staff/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                    
                });
                setOrderList(response.data.orderlist);
              }
           
          } catch (err) {
             
              console.error(err);
          }finally{
            setIsLoading(false);
          }
      };

      fetchOrders(); 
      setIsUpdated(false);
  }, [baseUrl, token,isUpdated]); 

 
    const handleUpdateOrder = async (id,email) => {
 
        try {
            const response = await axios.post(`${baseUrl}/staff/order`,
                {
                orderId: id,
                email: email,
                orderStatus:'DONE'
              }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Update successful:", response.data);
            setIsUpdated(true);
        } catch (err) {
            console.error(err);
        }finally{
          setIsLoading(false);
        }
    };

    return (
      isLoading ? (
        <Box sx={{ display: 'flex', mt:50, ml:100 }}>
          <CircularProgress />
        </Box>):(

        <div>
          <Typography variant="h5" gutterBottom paddingLeft={50}>Order List</Typography>
          {orderList.length > 0 ? (
            <Box display="grid" paddingLeft={50} gridTemplateColumns="repeat(auto-fill, minmax(700px, 1fr))" gap={4}>
              {orderList
                .filter(order => order.orderStatus !== 'DONE')
                .map(order => (
                  <Card key={order.orderId} variant="outlined" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginBottom: 2 }}>
                      <span>
                          <Typography variant="h5">Order No: {order.orderId}</Typography>
                          <Typography variant="body2" color="textSecondary">Ordered By: {order.orderBy.replace(/@[\w.-]+$/, '')}</Typography>
                      </span>
                      <span style={{ fontSize: '18px', marginRight:'10px'}}>
                            <Badge 
                              color="warning"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: 1,
                                backgroundColor: '#FFFF8F', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                              }}>
                              <AccessTime sx={{ fontSize: 16, marginRight: 1 }} />
                              {order.orderStatus}
                            </Badge>
                        </span>
                        </Box>
                      <Typography variant="body1" sx={{ marginTop: 2, fontWeight: 'bold' }}>Items</Typography>
                      {order.products.length > 0 ? (
                        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                          {order.products.map(product => (
                            <Box key={product.cartId} display="flex" alignItems="center" justifyContent="space-between" sx={{ marginBottom: 2 }}>
                            <Checkbox id={`product-${product.cartId}`} 
                              cartid={`product-${product.cartId}`}
                              checked={checkedItems[order.orderId]?.[product.cartId] || false}
                              onChange={() => handleCheckboxChange(order.orderId, product.cartId)}
                            />
                            <label htmlFor={`product-${product.cartId}`} style={{ flexGrow: 1 }}>
                              {product.productName} x {product.quantity}
                            </label>
                            <span style={{ fontSize: '18px', marginRight:'10px'}}>
                              ₱{(product.price * product.quantity).toFixed(2)}
                            </span>
                          </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2">No products in this order.</Typography>
                      )}
                      <Divider/>
                      <Typography variant="body1" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginBottom: 2 }}>
                        <span style={{ fontSize: '20px' }}>Total Price:</span>
                        <span style={{ fontSize: '20px' }}>₱{order.products.reduce((sum, product) => sum + product.price * product.quantity, 0).toFixed(2)}</span>
                      </Box>
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center' }}>
                      <Button 
                        variant="contained"
                        sx={{
                            backgroundColor: '#8B4543', 
                            '&:hover': {
                              backgroundColor: '#693432', 
                            },
                          }}
                        fullWidth
                        onClick={() => handleUpdateOrder(order.orderId, order.orderBy)}
                        disabled={!isAllChecked(order.orderId, order.products)} 
                        

                      >
                        Done
                      </Button>
                    </CardActions>
                  </Card>
                ))}
            </Box>
          ) : (
            <Typography>No orders found.</Typography>
          )}
          
        </div>
    ));
    }

    export default MyViewOrders;

MyViewOrders.propTypes = {
    token:PropTypes.string.isRequired,
    };

const StyledWrapper = styled.div`
  .card {
   width: 320px;
   height: 730px;

   border-radius: 7px;
   box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
  }`;
