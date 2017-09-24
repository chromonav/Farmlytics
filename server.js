var express = require('express')
    , exphbs = require('express-handlebars')
    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , app = express()
    , port = process.env.PORT || 8000
    , router = express.Router()
    , moment = require("moment");
var session = require('express-session');
const request = require("request");
const rp = require('request-promise')
const _ = require("lodash")
const fs = require('fs')
require('dotenv').config()
const exec = require('child_process').exec;
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./../db.json')
const db = low(adapter)
db.defaults({ requirements: [] })
    .write()
// app.use(morgan('dev'));                     // log every request to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());                  // simulate DELETE and PUT
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(session({
    secret: '016F9D5F268654BB20B1691BFFAFBC88B0EC6DC8A1318B314D467AC84A489056',
    resave: false,
    saveUninitialized: true
}));

app.use('/', router);


app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(function (req, res, next) {
    res.status(404).send("Sorry could not find that")
})

router.get('/', function (req, res, next) {

    res.render('index', {
        isSession: req.session.username ? true : false,
    });
    // if (req.session.username) {
    //     if (isAuth({ username: req.session.username, password: req.session.password })) {

    //     } else {
    //         res.render('signin', { error: "Wrong Password" })
    //     }
    // } else {
    //     res.redirect('/signin')
    // }
});

router.get('/signin', function (req, res, next) {
    res.render('signin', { isSession: req.session.username ? true : false });
});
router.post('/signin', function (req, res, next) {
    // console.dir(req.body)
    if (isAuth(req.body)) {
        req.session.username = req.body.username;
        req.session.password = req.body.password;
        // console.dir(req.session)
        res.redirect('/')
    } else {
        res.render('signin', { error: "Wrong Username or Password" })
    }

})
router.post('/data', function (req, res, next) {
    // console.dir(req.body)
    data = req.body;
    db.get('requirements').push(data).write()
    res.send("success")
})
router.get('/signout', function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err)
        } else {
            // console.log('logout')
            res.redirect('/')
        }
    })
})
router.get("/buyer", function (req, res, next) {
    res.render('buyer')
})

router.post('/hello', function (req, res, next) {
    console.dir(req.body)
    var data = {
        date: [],
        month: [],
        year: [],
        Centre_Name: []
    }
    var start = moment(req.body.date)
    var end = start.add(req.body.days, 'd')

    var current;
    for (i = 0; i < req.body.days; i++) {
        current = start.add(1, 'd')
        data.date.push(current.format("D"))
        data.month.push(current.format("M"))
        data.year.push(current.format("YY"))
        data.Centre_Name.push(req.body.market)
    }
    console.dir(data)
    fs.writeFileSync("./../hello.json", JSON.stringify(data))
    exec('python tomato/main.py', (error, stdout, stderr) => {
        if (error) {
            // console.error(`exec error: ${error}`);
            // return;
        }
        var max = {
            date: "",
            price: 0
        }
        var tosend = [
            ["x"],
            ['prices']
        ]

        var prices = JSON.parse(stdout).output
        for (var i = 0; i < prices.length; i++) {
            tosend[0].push(`${data.year[i]}-${data.month[i]}-${data.date[i]}`)
            tosend[1].push(prices[i][0])
            if (max.price < prices[i][0]) {
                max.price = prices[i][0];
                max.date = `${data.year[i]}-${data.month[i]}-${data.date[i]}`
            }
        }
        day = moment(max.date, "YY-M-D");
        var ticktock = db.get('requirements').filter(function (a, b, c) {
            return true
        }).value()
        console.dir(ticktock)
        var mainsend = {
            chart: tosend,
            fromnow: day.fromNow(),
            price: max.price,
            ticktock: ticktock
        }
        res.send(mainsend)

        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
})
app.listen(port);


console.log('App running on port', port);

const isAuth = function (details) {
    // console.dir(details)
    if (details.username == "Deazz" && details.password == "Deazz") {
        return true;
    } else return false;
}








var options = {
    pythonOptions: ['-u'],
    mode: 'text',
    args: ['my First Argument', 'My Second Argument', '--option=123']
};



// var datatosend = JSON.stringify({
//     "date": [30],
//     "month": [10],
//     "year": [2013],
//     "Centre_Name": ["SHILLONG"]
// })


// var spawn = require('child_process').spawn,
//     py = spawn('python', ['compute_input.py']),
//     data = [1, 2, 3, 4, 5, 6, 7, 8, 9],
//     dataString = '';