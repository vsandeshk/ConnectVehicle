const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./api/routes')
const port = 3000;

module.exports = () => {
  const app = express()


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.listen(port, () => console.log("Hello! I am listening at 3000"));

}
