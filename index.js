const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const corsMiddleware = require('./middleware/cors.middleware');

const authRouter = require('./routes/auth.routes')
const gameRouter = require('./routes/game.routes')

const app = express();
const PORT = config.get('serverPort');

app.use(corsMiddleware);
app.use(express.json())
app.use("/api/auth", authRouter);
app.use("/api/game", gameRouter);
app.get("/", (req, res) => {
  res.status(300).json({message: `User`})
});
const start = async () => {
  try {
    await mongoose.connect(config.get('dbUrl'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })

    app.listen(PORT, () => {
      console.log('Server started on port :', PORT)
    })
  } catch (error) {
    console.log(error)
  }
}

start();
