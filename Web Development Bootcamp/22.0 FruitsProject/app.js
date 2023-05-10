const mongoose = require("mongoose");
const { Schema } = mongoose;

//mongoose.connect("mongodb://localhost:27017/fruitsDB", { useNewUrlParser: true });
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fruitsDB');

    const fruitSchema = new Schema({
        name: {
            type: String,
            required: [true, "Please check your data entry, no name speified"]
        },
        rating: {
            type: Number,
            min: 1,
            max: 10
        },
        review: String
    });

    const Fruit = mongoose.model("Fruit", fruitSchema);

    const fruit = new Fruit({
        name: "Peaches",
        rating: 9,
        review: "Peaches are the best!"
    });

    //await fruit.save();

    const personSchema = new Schema({
        name: String,
        age: Number,
        favouriteFruit: fruitSchema,
    });

    const Person = mongoose.model("Person", personSchema);

    // const strawberry = new Fruit({
    //     name: "Strawberry",
    //     rating: 1,
    //     review: "Ew strawberries!"
    // });

    // await strawberry.save();

    // const person = new Person({
    //     name: "Amy",
    //     age: 12,
    //     favouriteFruit: pinapple,
    // });


    //await person.save();

    const fruits = await Fruit.find({});
    for (let fruit of fruits) {
        console.log(fruit.name);
    }

    // await Fruit.updateOne({ _id: "644947c0fcce2a2616c686b8" }, { rating: 1 }).then(function () {
    //     console.log("Record updated succesfully!");
    // }).catch(function (err) {
    //     console.log(err);
    // });

    // await Fruit.deleteOne({ name: 'Peaches' }).then(function () {
    //     console.log("Deleted record succesfully!")
    // }).catch(function (err) {
    //     console.log(err);
    // });

    // const deletedRecords = await Person.deleteMany({ name: "Ahmed" });
    // console.log("number of deleted records: "+ deletedRecords.deletedCount);

    mongoose.connection.close();
}

