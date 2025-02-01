import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const Login = () => {
	const { login, checkAuth, isAuthenticated } = useAuthStore()
	const [id, setIdInput] = useState('')
	const [token, setTokenInput] = useState('')
	const navigate = useNavigate()

	useEffect(() => {
		checkAuth()
		if (isAuthenticated) {
			navigate('/contacts')
		}
	}, [isAuthenticated, navigate, checkAuth])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!id || !token) {
			alert('Введите ID и API Token!')
			return
		}
		await login(id, token)
		navigate('/contacts')
	}

	return (
		<div className='login-container'>
			<div className='login-form'>
				<h1>Вход в WhatsApp</h1>
				<form onSubmit={handleSubmit}>
					<label>ID Instance:</label>
					<input
						type='text'
						value={id}
						onChange={e => setIdInput(e.target.value)}
						placeholder='Введите ID'
					/>

					<label>API Token:</label>
					<input
						type='text'
						value={token}
						onChange={e => setTokenInput(e.target.value)}
						placeholder='Введите API Token'
					/>

					<button type='submit'>Войти</button>
				</form>
			</div>
		</div>
	)
}

export default Login
