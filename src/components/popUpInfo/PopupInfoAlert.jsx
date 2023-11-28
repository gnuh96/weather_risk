import * as React from 'react'
import {Typography} from '@mui/material'

export default function PopupInfoAlert({postal_code}) {
  return (
    <div className='popup'>
      <div className='popupText'>
        <Typography variant='subtitle2'>{postal_code}</Typography>
      </div>
    </div>
  )
}
