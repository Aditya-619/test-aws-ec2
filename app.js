require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user.js')

const app = express();

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Database connected');
};

app.use(express.json());
app.use('/api', userRoute);

app.listen(process.env.PORT, () => {
    console.log('server running');
});