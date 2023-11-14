import {useState, useRef} from 'react'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import mapboxgl from 'mapbox-gl'
import {MBXTOKEN} from '../constants/map'

export default function useMapboxHandler() {
  const mapRef = useRef(null)

  const [alert, setAlert] = useState([])

  const initMapWeatherRisk = mapRef => {
    mapboxgl.accessToken = MBXTOKEN
    const nav = new mapboxgl.NavigationControl()
    mapRef.current = new mapboxgl.Map({
      container: 'mapBox',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-82.5158, 27.9944],
      zoom: 5,
    })
    mapRef.current.addControl(nav, 'bottom-left')
  }

  const onLoadMapWeather = mapRef => {
    mapRef.current.on('load', () => {
      if (mapRef.current) {
        const geocoderContainer = document.getElementById('geocoder')

        if (geocoderContainer) {
          const geocoder = new MapboxGeocoder({
            accessToken: MBXTOKEN,
            mapboxgl: mapboxgl,
            countries: 'US',
            marker: false,
            types: 'postcode',
            placeholder: 'Search',
          })

          if (geocoderContainer.firstChild) {
            geocoderContainer.removeChild(geocoderContainer.firstChild)
          }

          geocoderContainer.appendChild(geocoder.onAdd(mapRef.current))
        }
      }
    })
  }

  return {
    mapRef,
    alert,
    initMapWeatherRisk,
    onLoadMapWeather,
  }
}
