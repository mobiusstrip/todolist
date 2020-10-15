const express = require('express')
const app = express()
const port = process.env.PORT //process.env.PORT || 3000, for heroku
const https = require('https');
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"))

app.set('view engine', 'ejs');

//Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://C3em:Starwars17@cherry.bmisi.mongodb.net/cherrydb?retryWrites=true&w=majority";', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

//create schema first
const itemsSchema = ({
  name: String
})

//mongoose creates model and collection with pluraled modelname
const Item = mongoose.model("Item", itemsSchema)


//creating and inserting the default items using model

const default1 = new Item({
  name: "Welcome to your todolist!"
})

const default2 = new Item({
  name: "plus adds stuff"
})

const default3 = new Item({
  name: "checkbox deletes"
})

const defaultItems = [default1, default2, default3]

//

app.get('/', function(req, res) {

  //finding using modelname
  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log("succesfully saved")
        }
      })
      res.redirect("/");
    } else {
      res.render('index', {
        listTitle: "Today",
        newItem: foundItems
      });
    }
  })

});


app.post("/", function(req, res) {

  const itemName = req.body.newItem

  const item = new Item({
    name: itemName
  })

  item.save()
  res.redirect("/")

});

//

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err) {
    if (err) {
      console.log(err)
      res.redirect("/")
    }
    else {
      console.log("A ok deleted")
    }
  })

});



app.listen(process.env.PORT, function() {
  console.log("App listening at port 3000")
});
//process.env.PORT || 3000, for heroku
