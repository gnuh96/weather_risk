export const MBXTOKEN = '' // il faut creer un mapbox token dans https://www.mapbox.com/

export const modelAlertLayer = {
  testLayer: {
    id: 'test',
    type: 'fill',
    source: 'test',
    paint: {
      'fill-outline-color': 'white',
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#5c5c5c',
        ['boolean', ['feature-state', 'click'], false],
        '#5c5c5c',
        '#767676',
      ],
    },
  },
  stormLayer: {
    id: 'thunder',
    type: 'fill',
    source: 'alerts',
    filter: ['any', ['==', ['get', 'type'], 'THUNDER']],
    paint: {
      'fill-outline-color': 'white',
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#a41cff',
        ['boolean', ['feature-state', 'click'], false],
        '#a41cff',
        '#7113af',
      ],
    },
  },
}
