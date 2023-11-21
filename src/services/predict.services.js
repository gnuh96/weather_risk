import instance from '../helpers/axios.instance'

const getPredictByPositionAndDate = async (date, latitude, longitude) => {
  const response = await instance.get(`/predict`, {
    params: {
      date,
      latitude,
      longitude,
    },
  })
  return response.data
}

const PredictionService = {
  getPredictByPositionAndDate,
}

export default PredictionService
