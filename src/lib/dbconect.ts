import mongoose from "mongoose";

type ConnectionObjext = {
  isConnected?: number;
};

const connection: ConnectionObjext = {};

async function dbconnect(): Promise<void> {
  // due to database stuck and perform optiomization pupose check isconnected or not
  if (connection.isConnected) {
    console.log("conencted");
    return;
  }
  try {
    // Database conenction
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    console.log("DATABSE", db, db.connections);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB CONENCTED SUCESSFULLY");
  } catch (error) {
    console.log("Databaseconnection failed", error);
    process.exit(1);
  }
}

export default dbconnect;
