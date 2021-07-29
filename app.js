const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const { renderFile } = require("ejs");
const app = express();
const _ = require("lodash");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine", "ejs");
// var items = [];
// var workItems = [];
mongoose.connect("mongodb+srv://MukeshKumar:Mukeshkumar@cluster0.otijd.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true,});
const itemSchema = {
    name:String
};

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
    name: 'Buy Food',
    });

const item2 = new Item({
    name: 'Take Food',
    });

const item3 = new Item({
    name: 'Eat Food',
    });

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model('List', listSchema);


app.get("/", function(req, res) {

    Item.find({}, function(err, foundItems){
        if(!err){

        if (foundItems.length === 0) {

            Item.insertMany(defaultItems, function(err){
                if (err){
                    console.log("error")
                } else{
                    console.log("succussfully added")
                    res.redirect("/");
                }
            });
        } else {
        res.render("list", {WorkList: "Today", nLItem: foundItems});
            }
        }
        else{
            console.log("error 1")
        }
        });
    

    // var day = "";

    // if (today.getDay() === 6||today.getDay() === 0) {
    //     day = "Weekend";
        
    // }else{
    //     day = "Weekday";
    // }
    // res.render("list", {kindOfDay: day});

//   if to print day

    // switch (today.getDay()) {
    //     case 0:
    //         day = "Sunday"
    //         break;
    //     case 1:
    //         day = "Monday"
    //         break;
    //     case 2:
    //         day = "Tuesday"
    //         break;
    //     case 3:
    //         day = "Wednesday"
    //         break;
    //     case 4:
    //         day = "Thurday"
    //         break;
    //     case 5:
    //         day = "Friday"
    //         break;
    //     case 6:
    //         day = "Saturday"
    //         break;
    
    //     default:
    //         console.log("Error")
    //         break;
    // }

    // let day = date.getDate();

    

});
app.post("/",function(req, res){
    const itemName = req.body.newitem ;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    })

    if(listName==="Today"){
        item.save(function(err){

            res.redirect("/")
        });
    } else {
        List.findOne({name: listName}, function(err, foundList){
            if(!err){
                foundList.items.push(item);
                foundList.save(function(err){

                    res.redirect("/" + listName);
                });
            } else{
                console.log("error2")
            }
        })
    }





})

app.post("/delete", function(req, res) {
    const toRemoveId = req.body.checkbox;
    const listName = req.body.listN;
    
    if (listName === "Today") {
    
        Item.findByIdAndRemove(toRemoveId, function(err){
            if (!err){
                console.log("successfully deleted");
                res.redirect("/")
            }
            else{
                console.log("error3")
            }
        });
    } else {
            List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: toRemoveId}}}, function(err, foundList) {
                if(!err) {
                    console.log("NO error")
                    res.redirect("/" + listName)
                }else {
                    console.log("error3");
                }
            })
        }



    });


app.get("/:cutomLName", function(req, res) {
    const listName = _.capitalize(req.params.cutomLName);

    List.findOne({name:listName}, function(err, foundIList){
        if(!err){
            if(!foundIList){
                const list = new List({
                    name: listName,
                    items: defaultItems
                });
                list.save(function(err){

                    res.redirect("/" + listName);
                });
            } else {
                res.render("list", {WorkList: foundIList.name, nLItem: foundIList.items});  
                // as the item has two properties name and items
                }
            }
            else{
                console.log("error 4")
            }
    })

});





let port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
}
app.listen(port, function() {
    console.log("Server is running successfully")
});