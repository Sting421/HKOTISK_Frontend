import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MyCartItemCard from './MyCartItemCard';
import { useState } from 'react';

// eslint-disable-next-line react/prop-types
export default function MyCart({ userCart }) {
  const [myCart] = useState(userCart);
  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
   
  };

  const list = (anchor) => (
    <Box
      sx={{ width:450, marginTop:8}}
      role="presentation"
      
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {myCart.map((cart) => (
        <MyCartItemCard
          key={cart.cartId}
          itemId={cart.cartId}
          itemName={cart.productName}
          itemQuantity={cart.quantity}
          itemPrice={cart.price}
        />
      
      ))}
      <Divider  sx={{marginTop:8}}/>
      Total Price
    </Box>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <ShoppingCartIcon />
          </Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
