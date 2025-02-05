import cors from 'cors'
import express from 'express'

const app = express()

// Разрешаем CORS
app.use(
	cors({
		origin: 'https://green-18bd1.web.app',
		methods: 'GET,POST,PUT,DELETE',
		allowedHeaders: 'Content-Type,Authorization',
	})
)

app.use(express.json())

app.get('/api', (req, res) => {
	res.json({ message: 'API работает!' })
})

// 404 обработчик
app.use((req, res) => {
	res.status(404).json({ error: 'Not Found' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`🚀 Server is running on port ${PORT}`)
})
