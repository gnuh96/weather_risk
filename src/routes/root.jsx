import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import './css/root.css'
import useMapboxHandler from '../hooks/useMapboxHandler'
import {useEffect, useState} from 'react'
import CustomAppBar from '../components/appBar/CustomAppBar'
import {Box, Drawer, Typography} from '@mui/material'
import dayjs from 'dayjs'
import DatePickerCustom from '../components/datePicker/DatePickerCustom'
import PredictionService from '../services/predict.services'
import AlertAccordionList from '../components/accordionList/AlertAccordionList'
import {Modal, ModalClose, Sheet} from '@mui/joy'
import DataGridCustom from '../components/dataGrid/DataGridCustom'
import StormDistributionChart from '../components/stormDistributionChart/StormDistributionChart'
import packageJson from '../../package.json'
import TornadoService from '../services/tornado.services'

const drawerWidth = 350
function Root(props) {
  const {mapRef, initMapWeatherRisk, onLoadMapWeather, alert} =
    useMapboxHandler()
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [alertMap, setAlertMap] = useState()
  const [openModalHistory, setOpenModalHistory] = useState(false)
  const [openModalStat, setOpenModalStat] = useState(false)
  const [stormData, setStormData] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await TornadoService.getHistoricalTornado()

        if (!response) {
          throw new Error('Data not found or inaccessible')
        }
        setStormData(response.tornado_data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!mapRef.current) {
      initMapWeatherRisk(mapRef)
      onLoadMapWeather(mapRef)
    }

    // return () => {
    //   if (mapRef.current) {
    //     mapRef.current.remove()
    //   }
    // }
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
  }, [alert, startDate])

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

  // useEffect(() => {
  //   if (data && mapRef.current) {
  //     const alertSource = mapRef.current.getSource('alerts')
  //     if (alertSource) {
  //       alertSource.setData(data)
  //     }
  //   }
  // }, [data])

  const handleChangeDateRange = date => {
    setStartDate(dayjs(date).format('YYYY-MM-DD'))
  }

  const handleOpenHistory = () => setOpenModalHistory(true)

  const handleOpenStat = () => setOpenModalStat(true)

  const cols = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      renderCell: params => formatDateString(params.value),
    },
    {field: 'ville', headerName: 'Ville', flex: 1},
    {field: 'RAIN_SUM', headerName: 'Rain Sum (mm)', flex: 1},
    {field: 'TEMP_MIN', headerName: 'Temperature (°C)', flex: 1},
    {field: 'WINDSPEED', headerName: 'Vitesse de vent (km/h)', flex: 1},
  ]

  const formatDateString = dateString => {
    // Assuming dateString is in the format DD-MM-YYYY
    const formattedDate = dayjs(dateString, 'DD-MM-YYYY').format('DD/MM/YYYY')
    return formattedDate
  }

  return (
    <div className='wrapperMap'>
      <div style={{display: 'flex', height: '100%'}}>
        <CustomAppBar
          title='Weather Risk'
          position='fixed'
          sx={{zIndex: theme => theme.zIndex.drawer + 1}}
        />

        <Modal
          aria-labelledby='modal-title'
          aria-describedby='modal-desc'
          open={openModalHistory}
          onClose={() => setOpenModalHistory(false)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Sheet
            variant='outlined'
            sx={{
              // maxWidth: 500,
              borderRadius: 'md',
              p: 3,
              boxShadow: 'lg',
            }}>
            <ModalClose variant='plain' sx={{m: 1}} />
            <Typography variant='h4'>Historique</Typography>
            <div
              style={{
                width: '900px',
                display: 'flex',
                justifyContent: 'center',
              }}>
              <DataGridCustom
                rows={stormData}
                cols={cols}
                maxHeight='80%'
                rowHeight={40}
              />
            </div>
          </Sheet>
        </Modal>
        <Modal
          aria-labelledby='modal-title'
          aria-describedby='modal-desc'
          open={openModalStat}
          onClose={() => setOpenModalStat(false)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Sheet
            variant='outlined'
            sx={{
              // maxWidth: 500,
              borderRadius: 'md',
              p: 3,
              boxShadow: 'lg',
            }}>
            <ModalClose variant='plain' sx={{m: 1}} />
            <Typography variant='h4'>Stat</Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}>
              <StormDistributionChart data={stormData} />
            </div>
          </Sheet>
        </Modal>
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
          <Box
            sx={{
              paddingLeft: '12px',
              paddingRight: '12px',
              paddingTop: 10,
              paddingBottom: 3,
            }}>
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
          {alertMap && alert && (
            <AlertAccordionList alert={alert} alertMap={alertMap} />
          )}

          <Box sx={{display: 'flex'}}>
            <div className='submitButton'>
              <button onClick={handleOpenHistory}>
                <span>Historique</span>
              </button>
            </div>
            <div className='submitButton'>
              <button onClick={handleOpenStat}>
                <span>Stats</span>
              </button>
            </div>
          </Box>
          <Box
            sx={{
              position: 'fixed',
              bottom: 10,
              display: 'flex',
              justifyContent: 'center',
              width: drawerWidth,
            }}>
            <Typography>{`V ${packageJson?.version || '0.0.0'}`}</Typography>
          </Box>
        </Drawer>
      </div>

      <div className='map-container' id='mapBox' />
    </div>
  )
}

export default Root
