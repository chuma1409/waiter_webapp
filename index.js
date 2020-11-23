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
app.get("/", async function(req, res){
  var allDays = await waiters.getDays()
    res.render('waiters', {
      allDays
    });
});
app.get("/waiters/:username", async function(req, res){
  
  const name =  req.params.username
  const days =  req.body.days
  


 
 var waiter = await waiters.addWaiter(name);
// console.log(waiter);
  // var day = await waiters.selectWorkingDays(name, days);
const allDays = await waiters.getDays()
  res.render('waiters', {
    // day,
       waiter: waiter,
    //  days:day,
     allDays
  })

}) 

app.post("/waiters/:username", async function(req,res){

 
    const name =  req.params.username
    const days =  req.body.days

 var waiter = await waiters.addWaiter(name);
// var waiterId = await waiters.nameId(name);

var day = await waiters.selectWorkingDays(name, days);
var allDays = await waiters.getDays()

    res.render('waiters', {
        username: waiter,
       day,
       allDays
    })
  
})


app.get("/days", async function(req, res){

  var allNames = await waiters.tablesJoined()
var allDays = await waiters.getDays()

  res.render('days', {
    allNames,
    allDays
 
  })

})



const PORT = process.env.PORT || 3330;


app.listen(PORT, function () {
  console.log("App started at port:", PORT)
});