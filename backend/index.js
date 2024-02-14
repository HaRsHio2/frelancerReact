const express =require("express")
const cors =require("cors")
const mongoose =require("mongoose")
const dotenv =require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json({limit : "10mb"}))

const PORT = process.env.PORT || 8080
//mongodb connection
mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("connected to database"))
.catch((err)=>console.log(err))

//schema
const useSchema = mongoose.Schema({
    firstName : String,
    lastName : String,
    email : {
        type : String,
        unique : true,
    },
    password : String,
    confirmPassword : String,
    image : String,
})

const userModel = mongoose.model("user",useSchema)

//api
app.get("/",(req,res)=>{
    res.send("server is running")
})

//sign up
app.post("/signup",async(req,res)=>{
    console.log(req.body)
    const {email} = req.body

    const result = await userModel.findOne({ email: email });

    if (result) {
        res.send({ message: "Email ID is already registered",alert : false });
    } else {
        const newUser = new userModel(req.body);
        const savedUser = await newUser.save();
        res.send({ message: "Successfully signed up", user: savedUser,alert:true });
    }
   /* userModel.findOne({email : email},(err,result)=>{
        console.log(result)
        console.log(err)
        if(result){
            res.send({message : "email id is already registered"})
        }
        else{
            const data=userModel(req.body)
            const save=data.save()
            res.send({message : "successfully sign up"})
        }
    })*/
})
//api login
app.post("/login",async(req,res)=>{
    console.log(req.body)
    const {email} =req.body
    const result = await userModel.findOne({ email: email });

    if (result) {
        const dataSend ={
            _id:result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            image: result.image,

        };
        console.log(dataSend)
        res.send({ message: "login successfull",alert : true ,data : dataSend});
    }
    else{
        res.send({ message: "Email ID is not available",alert : false });
    }
})

//product section
const schemaProduct = mongoose.Schema({
    name : String,
    category : String,
    image : String,
    price : String,
    description : String,
});
const productModel = mongoose.model("product",schemaProduct)

//save product in data
//api
app.post("/uploadProduct",async(req,res)=>{
    console.log(req.body)
    const data = await productModel(req.body)
    const datasave = await data.save()
    res.send({message : "Uploaded successfully"})
})

//
app.get("/product",async(req,res)=>{
    const data =  await productModel.find({})
    res.send(JSON.stringify(data))
})

//server is running
app.listen(PORT,()=>console.log("server is running at port :" + PORT))