
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const _= require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

  const itemSchema = new Schema({
    name: String,
  });

  const Item = mongoose.model("Item", itemSchema);

  const item1 = new Item({
    name: "Go Shopping"
  })

  const item2 = new Item({
    name: "Buy Groceries"
  })

  const item3 = new Item({
    name: "Call your family"
  })

  const defaultItems = [item1, item2, item3];

  const listSchema = new Schema({
    name: String,
    items: [itemSchema],
  });

  const List = mongoose.model("List", listSchema);



  app.get("/", async function (req, res) {

    const items = await Item.find({});

    if (items.length === 0) {
      Item.insertMany(defaultItems).then(function () {
        console.log("Succesfully saved items to your DB");
      }).catch(function (err) {
        console.log(err);
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: items });
    }
  });

  app.get("/:customListName", async function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    await List.findOne({ name: customListName }).then(async function (foundList) {
      if (!foundList) {
        //create new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        await list.save();
        res.redirect("/" + customListName);
      } else {
        //show an existing list
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items })
      }
    });

  });

  app.post("/", async function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
      name: itemName,
    })

    if (listName === "Today") {
      await item.save();

      res.redirect("/");
    } else {
      await List.findOne({ name: listName }).then(async function (foundList) {
        foundList.items.push(item);

        await foundList.save();

        res.redirect("/" + listName);

      }).catch(function (err) {
        console.log(err);
      })
    }
  });

  app.post("/delete", async function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {

      await Item.findByIdAndDelete(checkedItemId).then(function () {
        console.log("Deleted record succesfully!");
      }).catch(function (err) {
        console.log(err);
      })

      res.redirect("/");
    } else {
      List.findOneAndUpdate({ name: listName },
        { $pull: { items: { _id: checkedItemId } } }).then(function (foundList) {
          res.redirect("/" + listName);
        });
    }
  })

  app.get("/about", function (req, res) {
    res.render("about");
  });

  app.listen(3000, function () {
    console.log("Server started on port 3000");
  });
}


