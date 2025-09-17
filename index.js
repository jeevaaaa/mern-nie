import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app=express();
dotenv.config();

app.use(express.json());

const PORT =process.env.PORT || 7000;

const MONGOURL=process.env.MONGO_URL;
mongoose.connect(MONGOURL).then(()=>{
    console.log("Conected to MongoDB");
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
}
);

const userSchema = new mongoose.Schema({
    name : String,
    age : Number,
});

const UserModel = mongoose.model("mongoconnect",userSchema,"mongoconnect");

app.get("/getUsers",async(requestAnimationFrame,res)=>{
    const userData = await UserModel.find();
    res.json(userData);
});