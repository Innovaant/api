require('./db');

const app = require('express')();
const UserRouter = require("./router/UserApi");
const port = process.env.PORT || 3001;
const cors = require('cors');
app.use(cors())
// For accepting post form data
const bodyParser = require("express").json;
app.use(bodyParser());

app.use("/api", UserRouter);

app.listen(port, () => console.log('Server on', port));