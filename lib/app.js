"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require('babel-register')({
    presets: ['es2015'],
});
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler_1 = require("./middlewares/errorHandler");
const camelCaseReq_1 = require("./middlewares/camelCaseReq");
const snakeCaseRes_1 = require("./middlewares/snakeCaseRes");
const authRoute_1 = require("./routes/authRoute");
const userRoutes_1 = require("./routes/userRoutes");
require('./src/models');
const app = express();
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressValidator());
app.use(camelCaseReq_1.default);
app.use(snakeCaseRes_1.default());
app.use('/', authRoute_1.default);
app.use('/users', userRoutes_1.default);
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
app.use(errorHandler_1.default);
const { PORT } = process.env;
app.listen(PORT || 3000, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map