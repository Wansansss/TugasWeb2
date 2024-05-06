// mengimport library mongoose
const mongoose = require('mongoose');


// membuat model data untuk di database 
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
});

module.exports = mongoose.model('Category', categorySchema);