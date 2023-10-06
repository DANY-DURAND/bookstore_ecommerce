import mongoose from "mongoose";

export function mongooseConnect(){
    
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.asPromise();
    }else{
        const MONGODB_URI = process.env.MONGODB_URI;
        return mongoose.connect(MONGODB_URI);
    }
}