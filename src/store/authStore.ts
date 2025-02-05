import axios from 'axios'
import { create } from 'zustand'

export const useAuthStore = create<{
	idInstance: string
	apiTokenInstance: string
	isAuthenticated: boolean
	login: (id: string, token: string) => Promise<void>
	checkAuth: () => Promise<void>
	logout: () => Promise<void>
}>(set => ({
	idInstance: '',
	apiTokenInstance: '',
	isAuthenticated: false,

	login: async (idInstance, apiTokenInstance) => {
		try {
			await axios.post(
				'https://kacbj2n6.up.railway.app/api',
				{ idInstance, apiTokenInstance },
				{ withCredentials: true } // Отправляем куки
			)

			await useAuthStore.getState().checkAuth() // Проверяем авторизацию
		} catch (error) {
			console.error('Ошибка авторизации:', error)
		}
	},

	checkAuth: async () => {
		try {
			const response = await axios.get('https://kacbj2n6.up.railway.app/api', {
				withCredentials: true,
			})

			set({
				idInstance: response.data.idInstance,
				apiTokenInstance: response.data.apiTokenInstance,
				isAuthenticated: true,
			})
		} catch (error) {
			set({ idInstance: '', apiTokenInstance: '', isAuthenticated: false })
		}
	},

	logout: async () => {
		try {
			await axios.post(
				'https://kacbj2n6.up.railway.app/api',
				{},
				{ withCredentials: true }
			)
			set({ idInstance: '', apiTokenInstance: '', isAuthenticated: false })
		} catch (error) {
			console.error('Ошибка выхода:', error)
		}
	},
}))
