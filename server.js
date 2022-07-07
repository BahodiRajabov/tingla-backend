require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`\x1b[35mApp running on port ${port} \x1b[0m`);
});
