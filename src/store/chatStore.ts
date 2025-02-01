import { create } from 'zustand'

const STORAGE_KEY = 'chat_history'

export const useChatStore = create<{
	contacts: string[]
	chats: Record<string, { text: string; fromMe: boolean }[]>
	addContact: (phone: string) => void
	addMessage: (
		phone: string,
		message: { text: string; fromMe: boolean }
	) => void
	loadChats: () => void
}>(set => ({
	contacts: [],
	chats: {},

	addContact: phone =>
		set(state => {
			const updatedContacts = [...new Set([...state.contacts, phone])]

			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					contacts: updatedContacts,
					chats: state.chats,
				})
			)

			return { contacts: updatedContacts }
		}),

	addMessage: (phone, message) =>
		set(state => {
			const updatedChats = {
				...state.chats,
				[phone]: [...(state.chats[phone] || []), message],
			}

			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					contacts: state.contacts,
					chats: updatedChats,
				})
			)

			return { chats: updatedChats }
		}),

	loadChats: () => {
		const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

		// Если данные в localStorage есть – загружаем их
		set({
			contacts: storedData.contacts || [],
			chats: storedData.chats || {},
		})
	},
}))
