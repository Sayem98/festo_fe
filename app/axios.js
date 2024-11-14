import axios from 'axios'
const instance = axios.create({
  baseURL: process.env['NEXT_PUBLIC_API_URL'],
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
})

export default instance
