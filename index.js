import express from 'express'
import { connectDB } from './Config/db.js'
import { apiRouter } from './routes/index.js'
import cookieParser from 'cookie-parser'

const app = express()
const port = 3000
connectDB()

app.use(express.json())
app.use(cookieParser())


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use("/api",apiRouter)

app.all("*",(req,res,next)=>{
  res.status(404).json({message:"endpoint does not exist"})
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})