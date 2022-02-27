const redis_channels = require('./../../redis-channels');
const redis = require('redis');
const redis_sub_instance = redis.createClient();
redis_sub_instance.connect();

userChannel = async function(dev_id) {
  let channel_name = redis_channels.getUserChannel(dev_id);
  return new Promise((resolve, reject) => {
    console.log("check1: ", channel_name);

    redis_sub_instance.subscribe('user-notify', (message) => {
      console.log(message); // 'message'
    });

    redis_sub_instance.subscribe(channel_name, async (message) => {
      console.log("check2: ", message);
      let obj = JSON.parse(message);
      resolve(obj);
    });
  });
}

unsubscribeUserChannel = async function(dev_id){
  let channel_name = redis_channels.getUserChannel(dev_id);
  await redis_sub_instance.unsubscribe(channel_name);
}

publishVehicleChannel = async function(obj) {
  redis_instance = redis.createClient();
  await redis_instance.connect();
  let channel_name = redis_channels.getVehicleChannel(obj.device_id);
  let message = JSON.stringify(obj);

  redis_instance.publish(channel_name, message);

}

module.exports.vehicleInfo = async function(req, res) {
  /*
   * This function will request tcp web sockets to get information of vehicle
   * We assume that the protocols are already developed, so to give response, we will use dummy message
   * First we will check if vehicle is connected or not.
   * If vehicle is connected, the information will be returned
   */

  let device_id = req.params.device_id; // assuming that device id will be set as socket id.

  let obj = {};
  obj.device_id = device_id;
  obj.message = "HOW'S IT GOING?";
  //let success_obj = await subscribeUserChannel(device_id);
  //publish code
  await publishVehicleChannel(obj);

  let success_obj = await userChannel(device_id);

  res
    .status(200)
    .json(success_obj);

};

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
  //let success_obj = await subscribeUserChannel(device_id);
  //publish code
  await publishVehicleChannel(obj);

  let success_obj = await userChannel(device_id);

  res
    .status(200)
    .json(success_obj);

};
