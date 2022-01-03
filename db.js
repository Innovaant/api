const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://root:root1995@cluster0.hiukv.mongodb.net/innovant?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Mongo is UP.'))
    .catch(err => console.log('Mongo is Down. Raison :', err));