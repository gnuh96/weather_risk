import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import useMapboxHandler from '../hooks/useMapboxHandler'
import {useEffect, useRef, useState} from 'react'
import DenseAppBar from '../components/appBar/CustomAppBar'
import {Box, Drawer} from '@mui/material'
import './css/root.css'
const drawerWidth = 350

function Root(props) {
  const {mapRef, initMapWeatherRisk, onLoadMapWeather} = useMapboxHandler()
  useEffect(() => {
    initMapWeatherRisk(mapRef)
    onLoadMapWeather(mapRef)
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [mapRef, initMapWeatherRisk, onLoadMapWeather])
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
            <div
              id='geocoder'
              style={{
                paddingLeft: '12px',
                paddingRight: '12px',
                paddingTop: 10,
              }}
            />
          </Box>
        </Drawer>
      </div>

      <div className='map-container' id='mapBox' />
    </div>
  )
}

export default Root
