import axios from 'axios'
import { create } from 'zustand'
import { useAuthStore } from './authStore'
import { useChatStore } from './chatStore'

export const useMessageStore = create<{
	isFetching: boolean
	fetchMessages: () => Promise<void>
	sendMessage: (phone: string, message: string) => Promise<void>
}>(set => ({
	isFetching: false,

	fetchMessages: async () => {
		const { idInstance, apiTokenInstance } = useAuthStore.getState()
		const { addMessage } = useChatStore.getState()
		if (
			!idInstance ||
			!apiTokenInstance ||
			useMessageStore.getState().isFetching
		)
			return

		set({ isFetching: true })

		try {
			// Запрос с Long Polling (ожидание до 60 секунд)
			const response = await axios.get(
				`https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=60`
			)

			if (!response.data || !response.data.receiptId || !response.data.body) {
				console.log('Нет новых сообщений, повторяем запрос...')
				fetchMessages() // Повторяем запрос, если сообщений нет
				return
			}

			const { receiptId, body } = response.data

			if (
				body.typeWebhook === 'incomingMessageReceived' &&
				body.senderData?.chatId
			) {
				const phone = body.senderData.chatId.replace('@c.us', '')

				if (body.messageData?.textMessageData?.textMessage) {
					addMessage(phone, {
						fromMe: false,
						text: body.messageData.textMessageData.textMessage,
					})
				}
			} else {
				console.warn('Получено неизвестное уведомление:', body)
			}

			// Удаляем сообщение из очереди, чтобы оно не приходило снова
			await axios.delete(
				`https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`
			)

			console.log(
				`Новое сообщение от ${body.senderData?.chatId || 'неизвестного источника'}!`
			)

			// Сразу повторяем запрос, чтобы не ждать 10 секунд
			fetchMessages()
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 429) {
					console.warn('Превышен лимит запросов. Ждем 10 секунд...')
					setTimeout(fetchMessages, 10000)
				} else {
					console.error('Ошибка при получении сообщений:', error)
				}
			}
		} finally {
			set({ isFetching: false })
		}
	},

	sendMessage: async (phone, message) => {
		const { idInstance, apiTokenInstance } = useAuthStore.getState()
		const { addMessage } = useChatStore.getState()
		if (!idInstance || !apiTokenInstance || !phone || !message.trim()) return

		try {
			await axios.post(
				`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
				{ chatId: `${phone}@c.us`, message }
			)
			addMessage(phone, { fromMe: true, text: message })
		} catch (error) {
			console.error('Ошибка отправки сообщения', error)
		}
	},
}))
function fetchMessages() {
	throw new Error('Function not implemented.')
}
