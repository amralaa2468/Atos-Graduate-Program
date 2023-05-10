const express = require("express");
const bodyParser = require("body-parser");
const { title } = require("process");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {

    await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

    const articleSchema = new Schema({
        title: String,
        content: String,
    });

    const Article = mongoose.model("Article", articleSchema);

    //////////////////////////Requests targeting all articles/////////////////////////////////////////////////

    app.route("/articles")
        .get(async function (req, res) {

            await Article.find({}).then(function (foundArticles) {

                res.send(foundArticles);

            }).catch(function (err) {

                console.log(err);

            });
        })
        .post(async function (req, res) {
            //inputs came from postman body part as key value pair
            inputTitle = req.body.title;
            inputContent = req.body.content;

            const article = new Article({
                title: inputTitle,
                content: inputContent,
            });

            await article.save().then(function () {

                console.log("Article was added to the DB succesfully");
                res.send("Successfully added new article.");

            }).then(function (err) {

                res.send(err);

            });
        })
        .delete(async function (req, res) {

            Article.deleteMany({}).then(function (response) {

                res.send("Successfully deleted all records and their number is = " + response.deletedCount);

            }).catch(function (err) {

                res.send(err);

            });

        });
    /////////////////////////Requests targeting a specific article/////////////////////////////////////////////////

    app.route("/articles/:title")
        .get(async function (req, res) {

            const urlTitle = req.params.title;

            await Article.findOne({ title: urlTitle }).then(function (foundArticle) {

                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send("No articles matching that title was found!");
                }


            }).catch(function (err) {

                res.send(err);

            });
        })
        .put(async function (req, res) {

            const urlTitle = req.params.title;

            const inputTitle = req.body.title;
            const inputContent = req.body.content;

            await Article.replaceOne(
                { title: urlTitle },
                { title: inputTitle, content: inputContent }
            ).then(function (response) {

                if (response.acknowledged) {
                    res.send("Put done successfully!")
                } else {
                    res.send("Something went wrong with the update!");
                }

            }).catch(function (err) {

                res.send(err);

            });


        })
        .patch(async function (req, res) {

            const urlTitle = req.params.title;

            await Article.updateOne(
                { title: urlTitle },
                { $set: req.body }
                // set makes according to what data is passed in the body be updated
                //if title only then title gets updated
                //if content only then content gets updated
            ).then(function (response) {

                if (response.acknowledged) {
                    res.send("Patch done successfully!")
                } else {
                    res.send("Something went wrong with the update!");
                }
            }).catch(function (err) {

                res.send(err);
            });
        })
        .delete(async function (req, res) {

            const urlTitle = req.params.title;

            await Article.deleteOne({ title: urlTitle }).then(function (response) {
                if (response.deletedCount == 1) {
                    res.send("Deleted article successfully!")
                } else {
                    res.send("Can't delete the article or can't find it!")
                }
            }).catch(function (err) {
                res.send(err);
            });
        });






    app.listen(3000, function () {
        console.log("Server started on port 3000");
    });

}
