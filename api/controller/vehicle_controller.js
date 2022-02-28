const redis_channels = require('./../../redis-channels');
const redis = require('redis');
const redis_sub_instance = redis.createClient();
redis_sub_instance.connect();


/*
* This method is to subscribe device with userChannel.
* This method will messages from vehicle via tcp server & redis.
*/
userChannel = async function(dev_id) {
  let channel_name = redis_channels.getUserChannel(dev_id);
  return new Promise((resolve, reject) => {

    redis_sub_instance.subscribe(channel_name, async (message) => {
      let obj = JSON.parse(message);
      resolve(obj);
    });
  });
}

/*
* This method is to send the messages to the tcp server via redis pub/sub
* instance of tcp with a particular vehicle will subscribe to the channel.
* by this message, the subsribed vehicle will receive message from REST server.
*/
publishVehicleChannel = async function(obj) {
  redis_instance = redis.createClient();
  await redis_instance.connect();
  let channel_name = redis_channels.getVehicleChannel(obj.device_id);
  let message = JSON.stringify(obj);
  redis_instance.publish(channel_name, message);

}

/*
* This function will request tcp server by using redis pub/sub to get information of vehicle
* This vehicle (device id) should be subscribed to REST server to received the message.
* This method first use publish method to send the message
* Then it use subscribe method to receive the response from the vehicle.
*/
module.exports.vehicleInfo = async function(req, res) {


  let device_id = req.params.device_id; // assuming that device id will be set as socket id.

  let obj = {};
  obj.device_id = device_id;
  obj.message = "HOW'S IT GOING?";
  await publishVehicleChannel(obj);

  let success_obj = await userChannel(device_id);

  res
    .status(200)
    .json(success_obj);

};


/*
* This function will request tcp server by using redis pub/sub to set the frequency interval of vehicle
* This vehicle (device id) should be subscribed to REST server to received the message.
* This method first use publish method to send the message
* Then it use subscribe method to receive the response from the vehicle.
*/
module.exports.setUpdateFrequency = async function(req, res) {
  /*
   * This function will request tcp web sockets to set the updates time interval of vehicle
   * We assume that the protocols are already developed, so to give response, we will use dummy message
   * We will take device_id from url parameter. we assume that this is also set as tcp socket id.
   */

  let device_id = req.params.device_id; // assuming that device id will be set as socket id.
  let interval = req.body.time_interval; //interval can be 10-3600

  let obj = {};
  obj.device_id = device_id;
  obj.message = "KEEP ME POSTED EVERY "+interval+" SECONDS.";
  await publishVehicleChannel(obj);

  let success_obj = await userChannel(device_id);

  res
    .status(200)
    .json(success_obj);

};

/*
* This function will request tcp server by using redis pub/sub to send run/rest command to vehicle
* This vehicle (device id) should be subscribed to REST server to received the message.
* This method first use publish method to send the message
* Then it use subscribe method to receive the response from the vehicle.
*/
module.exports.sendCommand = async function(req, res) {

  let device_id = req.params.device_id; // assuming that device id will be set as socket id.
  let command = req.params.command; //interval can be 10-3600

  let obj = {};
  obj.device_id = device_id;
  obj.message = "HEY YOU, "+command+"!";

  await publishVehicleChannel(obj);

  let success_obj = await userChannel(device_id);

  res
    .status(200)
    .json(success_obj);

};
