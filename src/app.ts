require('dotenv').config();
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const morgan = require('morgan');
const cors = require('cors');
import errorHandler from './middlewares/errorHandler';
import camelcaseRequest from './middlewares/camelCaseReq';
import snakecaseResponse from './middlewares/snakeCaseRes';
import authRoutes from './routes/authRoute';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoute';

require('./models');

const app = express();

app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressValidator());
app.use(camelcaseRequest);
app.use(snakecaseResponse());

app.use('/', authRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);

app.use('/connect', (req, res) => {
  res.send(`
    <div style="
          height: 100%;
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center">
      <h1 style="color: #717171">Milky Auth Server!</h1>
    </div>
    `);
});

app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT || 3000, () => {
  console.log(`Server is running on port ${PORT}`);
});
