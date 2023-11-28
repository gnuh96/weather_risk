import {useState, useRef} from 'react'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import mapboxgl from 'mapbox-gl'
import {MBXTOKEN, modelAlertLayer} from '../constants/map'
import initData from '../constants/miami_zip_code.json'
import _ from 'lodash'
import {createRoot} from 'react-dom/client'
import PopupInfoAlert from '../components/popUpInfo/PopupInfoAlert'

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

    // mapRef.current.addSource('alerts', {
    //   type: 'geojson',
    //   generateId: true,
    //   data: initData,
    // })

    mapRef.current.addLayer(modelAlertLayer.testLayer)
  }

  const onClickWeatherRiskElement = (mapRef, popup) => {
    mapRef.current.on('click', e => {
      e.preventDefault()

      let clickedStateId = null

      if (clickedStateId) {
        mapRef.current?.setFeatureState(
          {source: 'test', id: clickedStateId},
          {click: false},
        )
      }

      const relatedFeatures = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: ['test'],
      })

      if (popup) {
        popup.remove()
      }

      if (relatedFeatures.length > 0) {
        const clickedFeatureId = relatedFeatures[0].id

        mapRef.current?.setFeatureState(
          {source: 'test', id: clickedFeatureId},
          {click: true},
        )

        clickedStateId = clickedFeatureId

        const clickedFeatureProperties = relatedFeatures[0].properties
        const container = document.createElement('div')
        createRoot(container).render(
          <PopupInfoAlert postal_code={clickedFeatureProperties.ZCTA5CE10} />,
        )
        popup = new mapboxgl.Popup({
          closeButton: false,
          anchor: 'center',
          offset: [0, -80],
        }).setDOMContent(container)
        setAlert(clickedFeatureProperties)
      } else {
        setAlert(null)
      }
    })
  }

  const setMouseHoverEventOnRiskElement = mapRef => {
    if (mapRef.current) {
      let hoveredStateId = null
      mapRef.current.on('mousemove', e => {
        if (mapRef.current) {
          mapRef.current.getCanvas().style.cursor = 'pointer'
          if (e.features && e.features.length > 0) {
            if (hoveredStateId !== null && hoveredStateId !== undefined) {
              mapRef.current.setFeatureState(
                {source: 'test', id: hoveredStateId},
                {hover: false},
              )
            }
            hoveredStateId = e.features[0].id
            mapRef.current.setFeatureState(
              {source: 'test', id: hoveredStateId},
              {hover: true},
            )
          }
        }
      })
      mapRef.current.on('mouseleave', () => {
        if (mapRef.current) {
          mapRef.current.getCanvas().style.cursor = ''
          if (hoveredStateId !== null) {
            mapRef.current.setFeatureState(
              {source: 'alerts', id: hoveredStateId},
              {hover: false},
            )
          }
        }
      })
    }
  }

  const onLoadMapWeather = mapRef => {
    mapRef.current.on('load', () => {
      let popup = null
      if (mapRef.current) {
        addAlertSourceAndLayer(mapRef)
        onClickWeatherRiskElement(mapRef, popup)
        setMouseHoverEventOnRiskElement(mapRef)
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
