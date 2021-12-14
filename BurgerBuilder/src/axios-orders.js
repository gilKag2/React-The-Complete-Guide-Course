import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://react-my-burger-cb384-default-rtdb.firebaseio.com/'
})

export default instance
