import instance from '../helpers/axios.instance'

const getPredictByPositionAndDate = async (date, latitude, longitude) => {
  const response = await instance.get(`/predict`, {
    params: {
      date,
      latitude,
      longitude,
    },
  })
  const res = {
    RAIN_SUM: response.data['RAIN_SUM'].toFixed(2),
    TEMP_MIN: response.data['TEMP_MIN'].toFixed(2),
    WINDSPEED: response.data['WINDSPEED'].toFixed(2),
    risk: response.data['predict_Tornado']['predict'],
    proba: response.data['predict_Tornado']['proba'].toFixed(2),
  }
  return res
}

const PredictionService = {
  getPredictByPositionAndDate,
}

export default PredictionService
