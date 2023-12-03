import instance from '../helpers/axios.instance'

const getHistoricalTornado = async () => {
  const response = await instance.get('/tornado')
  return response.data
}

const TornadoService = {
  getHistoricalTornado,
}

export default TornadoService
