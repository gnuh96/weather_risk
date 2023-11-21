import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import useMapboxHandler from '../hooks/useMapboxHandler'
import {useEffect, useState} from 'react'
import DenseAppBar from '../components/appBar/CustomAppBar'
import {Box, Drawer} from '@mui/material'
import dayjs from 'dayjs'

import './css/root.css'
import initData from '../constants/miami_zip_code.json'
import DatePickerCustom from '../components/datePicker/DatePickerCustom'
import PredictionService from '../services/predict.services'

const drawerWidth = 350

function Root(props) {
  const {mapRef, initMapWeatherRisk, onLoadMapWeather, alert} =
    useMapboxHandler()
  const [data, setData] = useState(initData)
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [alertMap, setAlertMap] = useState()

  useEffect(() => {
    initMapWeatherRisk(mapRef)
    onLoadMapWeather(mapRef)
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [mapRef, initMapWeatherRisk, onLoadMapWeather])

  useEffect(() => {
    const fetchAlertMapDay = async () => {
      if (alert) {
        try {
          const {INTPTLAT10, INTPTLON10} = alert
          const response = await PredictionService.getPredictByPositionAndDate(
            startDate,
            INTPTLAT10,
            INTPTLON10,
          )
          setAlertMap(response)
        } catch (error) {
          console.error(error)
        }
      } else {
        setAlertMap(null)
      }
    }
    fetchAlertMapDay()
  }, [alert])

  // useEffect(() => {
  //   const fetchAlertMapDay = async () => {
  //     try {
  //       const results = await Promise.all(
  //         initData.features.map(async item => {
  //           const {INTPTLAT10, INTPTLON10} = item.properties
  //           const response =
  //             await PredictionService.getPredictByPositionAndDate(
  //               startDate,
  //               INTPTLAT10,
  //               INTPTLON10,
  //             )
  //           console.log(response)
  //           return response
  //         }),
  //       )
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  //   fetchAlertMapDay()
  // }, [startDate])

  useEffect(() => {
    if (data && mapRef.current) {
      const alertSource = mapRef.current.getSource('alerts')
      if (alertSource) {
        alertSource.setData(data)
      }
    }
  }, [data])

  const handleChangeDateRange = date => {
    setStartDate(dayjs(date).format('YYYY-MM-DD'))
  }

  return (
    <div className='wrapperMap'>
      <div style={{display: 'flex', height: '100%'}}>
        <DenseAppBar
          title='Weather Risk'
          position='fixed'
          sx={{zIndex: theme => theme.zIndex.drawer + 1}}
        />
        <Drawer
          variant='permanent'
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}>
          <Box sx={{paddingLeft: '12px', paddingRight: '12px', paddingTop: 8}}>
            <DatePickerCustom
              startDate={dayjs(startDate).toDate()}
              onChange={handleChangeDateRange}
              onNextDate={() =>
                handleChangeDateRange(dayjs(startDate).add(1, 'days').toDate())
              }
              onPrevDate={() =>
                handleChangeDateRange(
                  dayjs(startDate).subtract(1, 'days').toDate(),
                )
              }
            />
            <div
              id='geocoder'
              style={{
                paddingLeft: '12px',
                paddingRight: '12px',
                paddingTop: 10,
              }}
            />
          </Box>
          {alertMap && (
            <ul>
              {Object.keys(alertMap).map((key, i) => (
                <li key={`alert_${i}`}>
                  <strong>{key}:</strong> {alertMap[key]}
                </li>
              ))}
            </ul>
          )}
        </Drawer>
      </div>

      <div className='map-container' id='mapBox' />
    </div>
  )
}

export default Root
