const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});//clean all data that was present
 initData.data.map((obj)=>({...obj,owner: "6534bf91a67897ebf7291b7c"}));
  await Listing.insertMany(initData.data);//insert new data from initData
  console.log("data was initialized");
};

initDB();