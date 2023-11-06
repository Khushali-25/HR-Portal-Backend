const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
    {
        fname: String,
        // lname: String,
        email: {type:String,Unique:true},
        password: String,
    },
    {
        collection: "Admin",
    }

   
);
mongoose.model("Admin", UserDetailsScehma);