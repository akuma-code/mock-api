import express from 'express'
import { __dirname } from './utils.js'
import projectRoutes from './routes/project.js'

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/project', projectRoutes)

app.get('/node_modules/*', (req, res) => {
  res.sendFile(`${__dirname}/${req.url}`)
})

app.use('*', (err, req, res, next) => {
  console.error(err)
  res.sendStatus(500)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http:///localhost:${PORT}`)
})
