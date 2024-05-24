const express = require('express')
const multer  = require('multer')
const routes  = require('./routes')
const cors = require('cors')
const app = express()
const port = 3010

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use('/app',routes)


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})