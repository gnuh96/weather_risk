import {useState, useRef} from 'react'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import mapboxgl from 'mapbox-gl'
import {MBXTOKEN, modelAlertLayer} from '../constants/map'
import initData from '../constants/miami_zip_code.json'

export default function useMapboxHandler() {
  const mapRef = useRef(null)
  const [alert, setAlert] = useState(null)

  const initMapWeatherRisk = mapRef => {
    mapboxgl.accessToken = MBXTOKEN
    const nav = new mapboxgl.NavigationControl()
    mapRef.current = new mapboxgl.Map({
      container: 'mapBox',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-80.19366, 25.77427],
      zoom: 10.5,
    })
    mapRef.current.addControl(nav, 'bottom-left')
  }

  const addAlertSourceAndLayer = mapRef => {
    mapRef.current.addSource('test', {
      type: 'geojson',
      generateId: true,
      data: initData,
    })

    mapRef.current.addLayer(modelAlertLayer.testLayer)
  }

  const onClickWeatherRiskElement = mapRef => {
    let clickedStateId = null

    mapRef.current.on('click', e => {
      e.preventDefault()

      if (clickedStateId) {
        mapRef.current?.setFeatureState(
          {source: 'test', id: clickedStateId},
          {click: false},
        )
      }

      const relatedFeatures = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: ['test'],
      })

      if (relatedFeatures.length > 0) {
        const clickedFeatureId = relatedFeatures[0].id

        mapRef.current?.setFeatureState(
          {source: 'test', id: clickedFeatureId},
          {click: true},
        )

        clickedStateId = clickedFeatureId

        const clickedFeatureProperties = relatedFeatures[0].properties
        setAlert(clickedFeatureProperties)
      } else {
        setAlert(null)
      }
    })
  }

  const onLoadMapWeather = mapRef => {
    mapRef.current.on('load', () => {
      if (mapRef.current) {
        addAlertSourceAndLayer(mapRef)
        onClickWeatherRiskElement(mapRef)
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
