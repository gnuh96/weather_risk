import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

export default function CustomAppBar(props) {
  const {title} = props

  return (
    <Box>
      <AppBar component='nav' {...props}>
        <Toolbar
          variant='dense'
          sx={{
            backgroundColor: '#D0D8E5',
            color: '#324A76',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
          }}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography
              variant='h6'
              component='div'
              sx={{display: {xs: 'none', sm: 'block'}}}>
              {title}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
