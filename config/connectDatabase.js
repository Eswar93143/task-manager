import mongoose from "mongoose";

export function connectDataBase(){
    mongoose.connect(process.env.DEV_CNN_STR);
}