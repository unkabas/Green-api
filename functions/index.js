import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5050

// ✅ **Правильные настройки CORS**
const allowedOrigins = [
	'http://localhost:5173', // Для локальной разработки
	'https://green-18bd1.web.app', // Firebase Production
]

app.use(
	cors({
		origin: allowedOrigins, // ✅ Разрешаем оба адреса
		credentials: true, // ✅ Разрешаем куки и заголовки авторизации
	})
)

app.use(express.json())
app.use(cookieParser())

// **1. Сохранение API-токена в `httpOnly` cookie**
app.post('/api/login', (req, res) => {
	const { idInstance, apiTokenInstance } = req.body

	if (!idInstance || !apiTokenInstance) {
		return res.status(400).json({ message: 'ID и API Token обязательны!' })
	}

	// Устанавливаем `httpOnly` cookie (невидимо для JavaScript)
	res.cookie('idInstance', idInstance, {
		httpOnly: true,
		secure: true, // ✅ Должно быть `true` для HTTPS
		sameSite: 'None', // ✅ Нужно для кросс-доменных запросов
	})

	res.cookie('apiTokenInstance', apiTokenInstance, {
		httpOnly: true,
		secure: true, // ✅ Обязательно для Firebase + Railway
		sameSite: 'None', // ✅ Фикс CORS-проблем
	})

	return res.json({ message: 'Авторизация успешна!' })
})

// **2. Получение токенов из `httpOnly` cookie**
app.get('/api/auth', (req, res) => {
	const { idInstance, apiTokenInstance } = req.cookies

	if (!idInstance || !apiTokenInstance) {
		return res.status(401).json({ message: 'Не авторизован' })
	}

	return res.json({ idInstance, apiTokenInstance })
})

// **3. Выход (удаляем куки)**
app.post('/api/logout', (req, res) => {
	res.clearCookie('idInstance', { sameSite: 'None', secure: true })
	res.clearCookie('apiTokenInstance', { sameSite: 'None', secure: true })
	return res.json({ message: 'Вы вышли' })
})

// **✅ Фикс preflight-запросов OPTIONS**
app.options('*', cors())

app.listen(PORT, () =>
	console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
)
