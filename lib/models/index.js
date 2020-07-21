const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI, {
    autoIndex: false,
    useNewUrlParser: true,
    useFindAndModify: false,
});
mongoose.connection.on('error', err => {
    console.error(err);
    process.exit();
});
mongoose.connection.once('open', () => {
    console.log(`Connected to MongoDB: ${MONGODB_URI}`);
});
//# sourceMappingURL=index.js.map