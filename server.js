import cors from 'cors'
import express from 'express'

const app = express()

// 🟢 Разрешаем CORS для всех (можно ограничить только для Firebase)
app.use(
	cors({
		origin: 'https://green-18bd1.web.app', // Разрешаем только фронтенд
		methods: 'GET, POST, PUT, DELETE',
		allowedHeaders: 'Content-Type,Authorization',
	})
)

app.use(express.json())

// 🔥 Проверь, есть ли API роут
app.get('/api', (req, res) => {
	res.json({ message: 'API работает!' })
})

// 🟢 404 для любых неизвестных маршрутов
app.use((req, res) => {
	res.status(404).json({ error: 'Not Found' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`🚀 Server is running on port ${PORT}`)
})
