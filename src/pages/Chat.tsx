import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import { useMessageStore } from '../store/messageStore'

const Chat = () => {
	const { phone } = useParams<{ phone?: string }>()
	const { isAuthenticated, checkAuth } = useAuthStore()
	const { chats, loadChats, addContact } = useChatStore()
	const { fetchMessages, sendMessage } = useMessageStore()
	const navigate = useNavigate()
	const [input, setInput] = useState('')

	useEffect(() => {
		checkAuth()
		if (!isAuthenticated) {
			navigate('/')
			return
		}
		loadChats()
		addContact(phone!)
		fetchMessages()
	}, [
		isAuthenticated,
		phone,
		navigate,
		fetchMessages,
		loadChats,
		addContact,
		checkAuth,
	])

	const handleSendMessage = () => {
		if (phone && input.trim()) {
			sendMessage(phone, input)
			setInput('')
		}
	}

	return (
		<div className='page-container'>
			{/* Верхняя панель */}
			<div className='header'>
				<span>Чат с {phone}</span>
				<button onClick={() => navigate('/contacts')}>Назад</button>
			</div>

			{/* Сообщения */}
			<div className='chat-container'>
				{phone &&
					chats[phone]?.map((msg, index) => (
						<div
							key={index}
							className={`message ${msg.fromMe ? 'sent' : 'received'}`}
						>
							{msg.text}
						</div>
					))}
			</div>

			{/* Поле ввода */}
			<div className='input-container'>
				<input
					type='text'
					value={input}
					onChange={e => setInput(e.target.value)}
					placeholder='Введите сообщение...'
				/>
				<button onClick={handleSendMessage}>Отправить</button>
			</div>
		</div>
	)
}

export default Chat
