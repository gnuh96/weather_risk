import React from 'react'
import PropTypes from 'prop-types'
import {IconButton} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const CustomInput = React.forwardRef((props, ref) => {
  const {disabled, onNext, onPrev, value, onClick} = props

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        border: '1px solid #aeaeae',
        width: '300px',
      }}>
      <IconButton disabled={disabled} onClick={onPrev} size='small'>
        <ChevronLeftIcon />
      </IconButton>
      <input
        disabled={disabled}
        style={{
          border: 'none',
          textAlign: 'center',
          minWidth: 0,
          backgroundColor: 'white',
        }}
        type='button'
        value={value}
        onClick={onClick}
        ref={ref}
      />
      <IconButton disabled={disabled} onClick={onNext} size='small'>
        <ChevronRightIcon />
      </IconButton>
    </div>
  )
})

CustomInput.propTypes = {
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onClick: PropTypes.func,
}

export default CustomInput
