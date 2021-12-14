let express = require("express");
let handle_bars = require("express-handlebars");
let fs = require("fs");
let dataService = require("./data-service")
// const { response } = require("express");
let app = express();
let HTTP_PORT = process.env.PORT || 8080;

// global users array
let Users = [];

app.use(express.static('views/images'));

app.engine(
    ".hbs",
    handle_bars.engine({
        extname: ".hbs",
        defaultLayout: "main",
        helpers: {
            navLink: function(url, options) {
                return (
                    "<li" +
                    (url == app.locals.activeRoute ? ' class="active" ' : "") +
                    '><a href="' +
                    url +
                    '">' +
                    options.fn(this) +
                    "</a></li>"
                );
            },
            equal: function(lvalue, rvalue, options) {
                if (arguments.length < 3)
                    throw new Error(
                        "Handlebars Helper equal needs 2 parameters"
                    );
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            },
            // increment number passed in by 1
            inc: function(value) {
                return parseInt(value + 1);
            },
        },
    })
);

app.set("view engine", ".hbs");

//enable midware to parse plain text
app.use(express.urlencoded({ extended: true }));

function onStart() {
    dataService.initialize()
    .then(function() {
        console.log("Express http server listening on " + HTTP_PORT);
    })
}

// home page
app.get("/", function(request, response) {
    response.render("home")
});

// about page
app.get("/about", function(request, response) {
    response.render("about");
});

// donate page
app.get("/donate", function(request, response) {
    response.render("donate");
})

app.post("/donate", function(request, response) {
    dataService.addDevice(request.body)
    .then(function(message) {
        response.redirect("/");
    })
});

// locations
app.get("/locations", function(request, response) {
    response.render("locations");
});

// devices
app.get("/devices", function(request, reponse) {
    reponse.render("devices")
});

app.get("/devices/iphone11", function(request, response) {
    response.render("iphone11");
});

app.get("*", function(request, response) {
    response.status(404).send("404 PAGE NOT FOUND");
});

app.listen(HTTP_PORT, onStart);
