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
    res.render('index');
});
app.get("/waiter", async function(){
 
})
app.post("/waiters", async function(req,res){

 
    const name =  req.body.userName
    const days =  req.body.days
    
  
    // req.flash('info', 'Flash Message Added');
if(!name && !days){
req.flash('errMsg','please enter your name and select 3 desired working days ')
}
else if(!days){
  req.flash('errMsg','please select 3 workig days')
}
else if(!name){
  req.flash('errMsg','please enter your name')
}
else if(isNaN(name) === false ){
    req.flash('errMsg','name should not be a number')
}
else {
    console.log(isNaN(name));
  await waiters.addWaiter(name, days);
   var waiter = await waiters.addWaiter(name);
}
    res.render('index', {
        waiter: waiter
  
    })
  
})


app.post("/days", async function(){

})



const PORT = process.env.PORT || 3330;


app.listen(PORT, function () {
  console.log("App started at port:", PORT)
});