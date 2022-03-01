require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const {UserRole} = require('./models/models')
// const router = require('./routes/indexRouter')
// const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', () => {})

// Errors, last Middleware
// app.use(errorHandler) TODO добавить хендлер

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ force: true})

        await UserRole.create({role: 'Администратор'})
        await UserRole.create({role: 'Оператор'})
        await UserRole.create({role: 'Пассажир'})

        app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()