import express from 'express'
import { connectDB } from './Config/db.js'
import { apiRouter } from './routes/index.js'
import cookieParser from 'cookie-parser'
import cors from "cors"
const app = express()
const port = 3000
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:["http://localhost:5173","https://cinehub-lemon.vercel.app/"],credentials:true,methods:["GET","POSt","PUT","DELETE","PATCH","OPTION"]}));

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