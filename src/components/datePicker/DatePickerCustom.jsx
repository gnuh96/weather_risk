import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'

import CustomInput from './CustomInput'

const DatePickerCustom = ({onChange, startDate, onNextDate, onPrevDate}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
      }}>
      <DatePicker
        customInput={<CustomInput onNext={onNextDate} onPrev={onPrevDate} />}
        dateFormat='dd/MM/yyyy'
        selected={startDate}
        onChange={date => onChange(date)}
        withPortal
      />
    </div>
  )
}

DatePickerCustom.propTypes = {
  onChange: PropTypes.func.isRequired,
  onNextDate: PropTypes.func,
  onPrevDate: PropTypes.func,
  startDate: PropTypes.instanceOf(Date).isRequired,
}

export default DatePickerCustom
