import mongoose from "mongoose";

export function connectDataBase(){
    mongoose.connect(process.env.PROD_CNN_STR, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(suc => {
        console.log('Connected');
    }).catch(err => {
        console.log(err);
    });
}