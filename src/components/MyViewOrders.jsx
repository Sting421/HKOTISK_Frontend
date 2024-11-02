import { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

function MyViewOrders( props) {
    const [order, setOrder] = useState(props.myOrder);
    const [error, setError] = useState('');
    useEffect(() => {
        console.log("This is orders:")
    
        console.log(order.orderId)
    
      }, );

    return (
        <>
        <div><p>test</p></div>
        <Card sx={{ borderRadius: '4%', width: '30rem', backgroundColor: 'inherit', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', maxHeight: '400px', maxWidth: '600px', minHeight: '300px', minWidth: '600px' }}>
        <CardContent>
            <Grid container spacing={3}>
            <Grid item xs={6}>
                {/* Additional content for left side if needed */}
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h6">Order ID: {order.orderId}</Typography>
                <Typography color="#883C40">Order By: {order.orderBy}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: '0.5rem' }}>
                Status: {order.orderStatus}
                </Typography>
            </Grid>
            </Grid>

            {error && <Typography color="error">{error}</Typography>}
        </CardContent>
        </Card></>
    );
    }

    export default MyViewOrders;