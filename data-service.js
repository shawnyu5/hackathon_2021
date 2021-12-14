require("dotenv").config()
let mongoose = require("mongoose")
let Schema = mongoose.Schema


let userSchema = new Schema ({
    "name": String,
    "address": String,
    "email": String,
    "deviceType": String,
    "modelNumber": String
})

let Device;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(process.env.CONNECTION_STRING);
        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });

        db.once('open', ()=>{
            Device = db.model("Devices", userSchema);
            resolve();
        });
    });
};

module.exports.addDevice = function(info) {
    return new Promise(function(resolve, reject) {
        let newDevice = new Device(info);
        newDevice.save(error => {
            if(error) {
                if(error.code == 11000) {
                    reject("Unable to add new device");
                }
                else {
                    resolve("Device registered");
                }
            }
            resolve("Device registered");
        })
    })
};
