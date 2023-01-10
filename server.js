const express = require('express');
const dotenv = require('dotenv').config({
  path: '.env'
});
const port = process.env.PORT || 5000;
const app = express();
let cors = require('cors');

const {
  errorHandler
} = require("./middlewares/errorHandler");

const connectDB = require('./config/db');
// konektovanje na bazu
connectDB.sequelize.authenticate();

// Prvo pokretanje aplikacije
(async () => {
  await connectDB.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await connectDB.sequelize.query("SET GLOBAL sql_mode = ''");
  await connectDB.sequelize.query(`SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`);
  await connectDB.sequelize
    .sync({
      // force: true,
      // alter: true
    }).then(async () => {
      // await connectDB.insertStaticDate();
      // await connectDB.startDB();
      await connectDB.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('DB started');
    })
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.get("/", (req, res) => {
  res.send("Test");
});

app.use("/api/articles", require("./routes/articlesRoute"));
app.use("/api/articleconfigurator", require("./routes/articleConfiguratorRoute"));
app.use("/api/storageconfigurator", require("./routes/storageConfiguratorRoute"));
app.use("/api/invoice", require("./routes/invoiceRoute"));
app.use("/api/invoice-article", require("./routes/invoiceArticleRoute"));
app.use("/api/cash-register", require("./routes/cashRegisterRoute"));
app.use("/api/method-of-payment", require("./routes/methodOfPaymentRoute"));
app.use("/api/storage", require("./routes/storageRoute"));


/* User management  */
app.use('/api/companies', require('./routes/companiesRoute'));
app.use('/api/users', require('./routes/usersRoute'));
app.use('/api/groups', require('./routes/groupsRoute'));
app.use('/api/functions', require('./routes/functionsRoute'));
app.use("/api/method-of-payment", require("./routes/methodOfPaymentRoute"));


/* User management  */


/* FINANCE */

/* FINANCE */



app.use(errorHandler);

app.listen(port, () => {
  console.log('Server started on port ' + port);
});