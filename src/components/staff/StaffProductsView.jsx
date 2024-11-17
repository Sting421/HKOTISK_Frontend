import React, { useState, useEffect } from 'react'
import {
  Grid,
  Box,
  Fab,
  Menu,
  MenuItem,
  Dialog,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'
import AddProducts from './AddProducts'
import MyUpdateProduct from './MyUpdateProduct'
import MyItemCard from '../ui/MyItemCard'
import { useNavigate } from 'react-router-dom'

const baseUrl = import.meta.env.VITE_BASE_URL

export default function StaffProductsView() {
  const [products, setProducts] = useState([])
  const [token, setToken] = useState(null)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isDeleted, setIsDeleted] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [menuProduct, setMenuProduct] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token')
    if (!storedToken) {
      navigate('/auth')
      return
    }

    // Clean the token once and store it
    const cleanToken = storedToken.replace(/^"|"$/g, '')
    setToken(cleanToken)
    fetchProducts(cleanToken)
  }, [isDeleted, navigate])

  const fetchProducts = async (authToken) => {
    try {
      const response = await axios.get(`${baseUrl}/user/product`, {
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      if (response?.data?.oblist) {
        setProducts(response.data.oblist)
      } else if (response?.data) {
        setProducts(response.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      if (error.response?.status === 403) {
        sessionStorage.removeItem('token')
        navigate('/auth')
      }
    }
  }

  const handleAddClick = () => {
    setOpenAddDialog(true)
  }

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false)
    fetchProducts(token)
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setSelectedProduct(null)
    fetchProducts(token)
  }

  const handleMenuClick = (event, product) => {
    console.log('Menu clicked:', event.currentTarget, product)
    setAnchorEl(event.currentTarget)
    setMenuProduct(product)
  }

  const handleMenuClose = () => {
    console.log('Menu closing')
    setAnchorEl(null)
    setMenuProduct(null)
  }

  const handleEditClick = (product) => {
    setSelectedProduct(product)
    setOpenEditDialog(true)
    handleMenuClose()
  }

  const handleDeleteClick = async (product) => {
    try {
      const cleanToken = token.replace(/^"|"$/g, '')
      await axios.delete(`${baseUrl}/staff/product?productId=${product.productId}`, {
        headers: { 
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
      })
      setIsDeleted(!isDeleted)
      handleMenuClose()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>
      
      <Grid 
        container 
        spacing={4} 
        sx={{ 
          py: 2,
          px: 1
        }}
      >
        {products.map((product) => (
          <Grid 
            item 
            key={product.productId} 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3}
          >
            <Box 
              sx={{ 
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <MyItemCard
                itemSize={Array.isArray(product.sizes) ? product.sizes : []}
                price={Array.isArray(product.prices) ? product.prices : [product.price]}
                productId={product.productId}
                itemQuantity={product.quantity}
                itemImage={product.productImage}
                itemName={product.productName}
                itemDescription={product.description}
                token={token}
                setIsDeleted={setIsDeleted}
              />
              <Box
                className="menu-icon"
                onClick={(e) => handleMenuClick(e, product)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 2,
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <MoreVertIcon fontSize="small" />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddClick}
      >
        <AddIcon />
      </Fab>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleEditClick(menuProduct)}>
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(menuProduct)}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="md" fullWidth>
        <AddProducts 
          token={token} 
          setIsDeleted={setIsDeleted} 
          setOpenDialog={setOpenAddDialog}
        />
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
        <MyUpdateProduct
          token={token}
          setIsDeleted={setIsDeleted}
          setOpenDialog={setOpenEditDialog}
          productId={selectedProduct?.productId}
          price={Array.isArray(selectedProduct?.prices) ? selectedProduct.prices : [selectedProduct?.price]}
          itemName={selectedProduct?.productName}
          itemImage={selectedProduct?.productImage}
          itemDescription={selectedProduct?.description}
          itemSize={selectedProduct?.sizes || []}
          itemQuantity={Array.isArray(selectedProduct?.quantities) ? selectedProduct.quantities : 
                       Array.isArray(selectedProduct?.quantity) ? selectedProduct.quantity : 
                       [selectedProduct?.quantity]}
          myToken={token}
        />
      </Dialog>
    </Box>
  )
}