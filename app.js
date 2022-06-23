const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Student = require("./models/student");
const methodOverride = require("method-override");

//middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.set("vies engieen","ejs");


//mongoose connect
mongoose.connect("mongodb://localhost:27017/studentDB",{
    useNewUrlParser : true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("Succeefully connected to mongoDB ");
})
.catch((e)=>{
    console.log("Connection failed.");
    console.log(e);
})


//Routing
// app.get("/",(req,res)=>{
//     res.send("this is homepage.");
// });

app.get("/students", async (req,res)=>{
    try{
        let data = await Student.find();
        res.send(data);
        // res.render("students.ejs",{data}); 
    } catch{
        res.send({message:"Error With fine data."});
    }     
});

// app.get("/students/insert",(req,res)=>{
//     res.render("studentInsert.ejs"); 
// });

app.get("/students/:id", async (req,res)=>{
    let { id } = req.params;
    try{
        let data = await Student.findOne({ id });
        if(data !== null){
            res.send(data);
        }else{
            res.status(404);
            res.send({message:"cannot find data"});
        }      
    } catch (e) {
        res.send("Error !!!");
        console.log(e);
    }
});

app.post("/students",(req,res)=>{
    let{id,name,age,merit,other} = req.body;
    let newStudent = new Student({id,name,age,scholarship:{merit,other}});
    newStudent
    .save()
    .then(()=>{
        res.send({message:"successfully post a new student"});
    })
    .catch((e)=>{
        res.status(404);
        res.send(e);
    });
});
// app.get("/students/edit/:id", async (req,res)=>{
//     let {id} = req.params;
//     try{
//         let data =  await Student.findOne({id});        
//         if(data !== null)
//         {
//             res.render("edit.ejs",{data});
//         }else{
//             res.send("cannot find student");
//         }
//     }catch{
//         res.send("ERROR !!!");
//     }
    
// });
app.put("/students/:id", async (req,res)=>{
    let {id,name,age,merit,other} = req.body;
    try{
        let d = await Student.findOneAndUpdate(
            {id},
            {id,name,age,scholarship:{merit,other}},
            { 
                new:true,
                runValidators:true,
                overwrite:true, //  可以覆蓋掉整筆資料
            }
        );
        res.send("Successfully updatad the data")
    } catch{
        res.status(404);
        res.send(e);
    }    
});

//for patch 
class newData{
    constructor(){}
    setProperty(key,value){
        if(key !== "merit" && key !=="other"){
            this[key] = value;
        }else{
            this[`scholarship.${key}`] = value;
        }
    }
    
}

app.patch("/students/:id",async (req,res)=>{
    let {id} = req.params;
    let {name,age,merit,other} = req.body;
    let newObject = new newData();
    for(let property in req.body){
        newObject.setProperty(property,req.body[property]);
    }
    console.log(newObject);
    try{
        let d = await Student.findOneAndUpdate(
            {id},
            newObject,
            { 
                new:true,
                runValidators:true,
            }
        );
        console.log(d);
        res.send("Successfully updatad the data")
    } catch{
        res.status(404);
        res.send(e);
    }    
});

app.delete("/students/delete/:id",(req,res)=>{
    let{id} = req.params;
    Student.deleteOne({id})
    .then((meg)=>{
        console.log(meg);
        res.send("Delete Successfully. ");
    })
    .catch((e)=>{
        console.log(e);
        res.send("Delete faild.");
    });
});

app.delete("/student/delete",(req,res)=>{
    Student.deleteMany({})
    .then((meg)=>{
        console.log(meg);
        res.send("Delete all dataSuccessfully. ");
    })
    .catch((e)=>{
        console.log(e);
        res.send("Delete faild.");
    });
});

app.get("/*",(req,res)=>{
    res.status(404);
    res.send("Not allowed.");
})
//connect port 3000
app.listen(3000,(req,res)=>{
    console.log("Server is running on part 3000.");
});