import {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {Doughnut} from 'react-chartjs-2'

import {Chart, ArcElement, Tooltip} from 'chart.js'

Chart.register(ArcElement, Tooltip)

AlertAccordionList.propTypes = {
  alertMap: PropTypes.object.isRequired,
  alert: PropTypes.object.isRequired,
}

function AlertAccordionList({alert, alertMap}) {
  const chartRef = useRef(null)

  const chartData = {
    labels: ['Probability', 'Other'],
    datasets: [
      {
        data: [alertMap.proba, 100 - alertMap.proba],
        backgroundColor: ['#F7464A', '#36A2EB'],
      },
    ],
  }

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
        aria-controls='panel1a-content'
        id='panel1a-header'
        sx={{width: '350px'}}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 1rem',
          }}>
          <Typography variant='h5'>{alert.ZCTA5CE10}</Typography>
          <div style={{height: '50px', width: '50px'}}>
            <Doughnut
              ref={chartRef}
              data={chartData}
              style={{height: '50px', width: '50px'}}
            />
          </div>
        </div>
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
