const express = require("express");
const app = express();
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },

    filename: (req, file, cb)=>{
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }

});

const upload = multer({storage: storage})

app.set('views', path.join(__dirname, "views")); 
app.set("view engine","ejs");

app.get("/uploads", (req,res)=>{
    res.render("uploads");
});

app.post("/uploads", upload.single('image'), (req,res)=>{
    res.send("uploaded successfully");
});

app.listen(3001);
// console.log("3001 is the port");