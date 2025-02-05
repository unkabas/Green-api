import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5050

// **✅ Добавляем CORS**
app.use(
	cors({
		origin: 'http://localhost:5173', // Разрешаем запросы с твоего фронта
		credentials: true, // Разрешаем куки и авторизационные заголовки
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
		secure: false, // Включи true, если используешь HTTPS
		sameSite: 'Lax',
	})

	res.cookie('apiTokenInstance', apiTokenInstance, {
		httpOnly: true,
		secure: false,
		sameSite: 'Lax',
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
	res.clearCookie('idInstance')
	res.clearCookie('apiTokenInstance')
	return res.json({ message: 'Вы вышли' })
})

// **✅ Разрешаем все методы CORS (для страховки)**
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, Content-Type, Accept, Authorization'
	)
	res.header('Access-Control-Allow-Credentials', 'true')
	next()
})

app.listen(PORT, () =>
	console.log(`Сервер запущен на http://localhost:${PORT}`)
)
