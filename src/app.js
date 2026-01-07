const express = require('express');
const { sequelize } = require('./models');
const routes = require('./routes/inventoryRoutes');

const app = express();

app.use('/api', routes);

const PORT = 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
});