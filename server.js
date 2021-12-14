let express = require("express");
let path = require("path")
let handle_bars = require("express-handlebars")
let app = express();


let HTTP_PORT = process.env.PORT || 8080;

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
    console.log("Express http server listening on " + HTTP_PORT);
}

app.get("/", function(request, response) {
    response.render("home")
});

app.get("/about", function(request, response) {
    response.render("about");
});

app.listen(HTTP_PORT, onStart);
