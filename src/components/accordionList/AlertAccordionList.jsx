import React from 'react'
import PropTypes from 'prop-types'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

AlertAccordionList.propTypes = {
  alertMap: PropTypes.object.isRequired,
  alert: PropTypes.object.isRequired,
}

function AlertAccordionList({alert, alertMap}) {
  const renderAccordionAlert = key => {
    if (key === 'RAIN_SUM') return `${key} : ${alertMap[key]} mm`
    if (key === 'TEMP_MIN') return `${key} : ${alertMap[key]} °C`
    if (key === 'WINDSPEED') return `${key} : ${alertMap[key]} km/h`
    if (key === 'proba') return `${key} : ${alertMap[key]} %`
    return `${key} : ${alertMap[key]}`
  }
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'>
        <Typography>{alert.ZCTA5CE10}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ul>
          {Object.keys(alertMap).map((key, i) => (
            <li key={`alert_${i}`}>
              <Typography>{renderAccordionAlert(key)}</Typography>
            </li>
          ))}
        </ul>
      </AccordionDetails>
    </Accordion>
  )
}

export default AlertAccordionList
