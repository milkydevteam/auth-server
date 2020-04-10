require('dotenv').config();

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');
const camelcaseRequest = require('./src/middlewares/camelCaseReq');
const snakecaseResponse = require('./src/middlewares/snakeCaseRes');

// import route
const authRoutes = require('./src/routes/authRoute');
const userRoutes = require('./src/routes/userRoutes');

require('./src/models');

const app = express();

app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressValidator());
app.use(camelcaseRequest);
app.disable('x-powered-by');
app.use(snakecaseResponse());

app.use('/', authRoutes);
app.use('/users', userRoutes);

app.use('/test', (req, res) => {
  res.send({ status: 1, message: 'Server Auth Milky' });
});

app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT || 3000, () => {
  console.log(`Server is running on port ${PORT}`);
});
