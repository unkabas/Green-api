import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Chat from './pages/Chat'
import Contacts from './pages/Contacts'
import Login from './pages/Login'

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/contacts' element={<Contacts />} />
				<Route path='/chat/:phone' element={<Chat />} />
			</Routes>
		</Router>
	)
}

export default App
