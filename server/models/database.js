// mengimport library mongoose
const mongoose = require('mongoose');
require('dotenv').config()
// mengkonekkan ke database menggunakan monggose berdasarkan url yang ada di .env
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// mengecek apa sudah terkonek ke database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Connected')
});

// mengimport Models data 
require('./Category');
require('./Recipe');
require('./User');