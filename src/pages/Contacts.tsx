import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'

const Contacts = () => {
	const { isAuthenticated, checkAuth } = useAuthStore()
	const { contacts, addContact, loadChats } = useChatStore()
	const [search, setSearch] = useState('')
	const navigate = useNavigate()

	useEffect(() => {
		checkAuth()
		if (!isAuthenticated) {
			navigate('/')
			return
		}
		loadChats()
	}, [isAuthenticated, navigate, checkAuth, loadChats])

	const handleSearch = () => {
		if (search.trim()) {
			addContact(search)
			navigate(`/chat/${search}`)
		}
	}

	return (
		<div className='page-container'>
			<div className='header'>Контакты</div>

			<div className='input-container'>
				<input
					type='text'
					placeholder='Введите номер'
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<button onClick={handleSearch}>Найти</button>
			</div>

			<div className='contacts-container'>
				{contacts.map((contact, index) => (
					<div
						key={index}
						className='contact-item'
						onClick={() => navigate(`/chat/${contact}`)}
					>
						{contact}
					</div>
				))}
			</div>
		</div>
	)
}

export default Contacts
