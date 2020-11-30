const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const Waiters = require("./waiters");
// const route = require("./routes")
const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://chuma:pg123@localhost:5432/waiters_webapp';
const pool = new Pool({
  connectionString
});
const waiters = Waiters(pool)
// const routes = route(registrations)

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// app.engine('handlebars', exphbs({
//     layoutsDir: './views/layouts'
// }));

app.use(express.static('public'));
;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// initialise session middleware - flash-express depends on it
app.use(session({
  secret: "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());
app.get("/waiters/", async function (req, res) {

  res.render('landing', {

  });
});
app.get("/waiters/:username", async function (req, res) {

  const name = req.params.username
  const allDays = await waiters.chosenDays(name)
  res.render('waiters', {
    username: name,
    allDays
  })

})

app.post("/waiters/:username", async function (req, res) {

  const days = req.body.checked
  const name = req.params.username

  var allDays = await waiters.chosenDays()
  var picked = await waiters.selectedWorkingDays(days, name);

  if (picked) {
    req.flash('success', 'shifts added')
  }
   else{
    req.flash('error', 'Please select atleast 2 shifts and up')
   }

  res.render('waiters', {
    username: name,
    picked,
    allDays
  })

})


app.get("/days", async function (req, res) {

  var allNames = await waiters.getAdminId()
  var allDays = await waiters.getDays()

  res.render('days', {
    allNames,
    allDays

  })

})
app.get("/clear", async function(req, res){
  await waiters.resetBtn()
  res.redirect("/days")

})



const PORT = process.env.PORT || 3330;


app.listen(PORT, function () {
  console.log("App started at port:", PORT)
});