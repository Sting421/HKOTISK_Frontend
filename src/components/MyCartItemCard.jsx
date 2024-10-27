
import { useState } from 'react';
import { Button, Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

// eslint-disable-next-line react/prop-types
function MyCartItemCard({ itemName , itemImage, itemPrice , itemDescription}) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Small');

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <Card style={{ borderRadius:'4%', width: '30rem', backgroundColor: '#f5f5f5', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', maxHeight:'400px', maxWidth:'500px', minHeight:'300px', minWidth:'500px'}}>
      <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={6}>
           <img
              src={`${itemImage}?height=60&width=60`}
              alt="Ice Coffee"
              style={{ width: '13rem', height: '11rem', objectFit: 'cover', borderRadius: '0.375rem' }}
            />
         </Grid>
         <Grid item xs={6} >
            {/* Item Name */}
                <Typography variant="h6">{itemName}</Typography>
            {/*End of Item Name*/}
            
            {/* Item price */}
                <Typography  color="#883C40">P{itemPrice}</Typography>
            {/* End of item price */}
        {/* Description */}
            <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                {itemDescription}
            </Typography>
        {/*End of Description */}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
      <Grid item xs={6} >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop:'30px', marginLeft:"50px"}}>
            <IconButton size="small" onClick={decrementQuantity}>
              <RemoveCircleOutlineIcon fontSize="medium" />
            </IconButton>
            <Typography>{quantity}</Typography>
            <IconButton size="small" onClick={incrementQuantity}>
              <AddCircleOutlineRoundedIcon fontSize="medium" />
            </IconButton>
          </div>
        </Grid>
        <Grid item xs={6} >
        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <Grid item xs={6} >
        <div style={{ display: 'flex', gap: '0.5rem', marginTop:'20px', marginLeft:'15px' }}>
            <Typography variant="body2" style={{ fontWeight: '500' , marginTop:'5px'}}>Size</Typography>
                {['Small', 'Large'].map((option) => (
                <Button
                  key={option}
                  variant={size === option ? 'contained' : 'outlined'}
                  size="small"
                  sx={{
                    borderRadius:' 0% 25% 25% 25% / 54% 54% 0% 46%',
                    backgroundColor: size === option ? '#757575' : 'transparent', 
                    color: size === option ? '#ffffff' : '#757575',
                    borderColor: '#757575', 
                    '&:hover': {
                      backgroundColor: size === option ? '#616161' : 'rgba(117, 117, 117, 0.1)', 
                      borderColor: size === option ? '#616161' : '#757575', 
                    },
                  }}
                  onClick={() => setSize(option)}
                >
                {option}
              </Button>
                ))}
            </div>
          </Grid>
        </div>
        <Grid item xs={12} >
        <div style={{  display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginLeft:'10px', marginTop:'9px'}}>
          <Button 
            variant="contained" 
            sx={{  borderRadius:' 10% 10% 10% 10% / 50% 50% 50% 50%', backgroundColor: '#883C40', '&:hover': { backgroundColor: '#6f2b2f' }, paddingLeft:'40px', paddingRight:'40px' }}
            >
            Add to Cart
            </Button>
        </div>
        </Grid>
        </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default MyCartItemCard