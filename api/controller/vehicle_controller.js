
module.exports.vehicleInfo = function (req, res) {
  /*
  * This function will request tcp web sockets to get information of vehicle
  * We assume that the protocols are already developed, so to give response, we will use dummy message
  * First we will check if vehicle is connected or not.
  * If vehicle is connected, the information will be returned
  */

  let device_id = req.params.device_id; // assuming that device id will be set as socket id.

  let success_message = "FINE. I'M HERE 45.021561650 8.156484, RESTING AND CHARGED AT 42%.";
  let error_message = "VEHICLE IS NOT CONNECTED.";

  res
  .status(200)
  .json(success_message);

};

module.exports.setUpdateFrequency = function (req, res) {
  /*
  * This function will request tcp web sockets to set the updates time interval of vehicle
  * We assume that the protocols are already developed, so to give response, we will use dummy message
  * We will take device_id from url parameter. we assume that this is also set as tcp socket id.
  * first we will check if device connected. Then we will set the interval.
  * we assume that the protocol is already developed and called in this function. so we will directly give response.
  */

  let device_id = req.params.device_id; // assuming that device id will be set as socket id.
  let interval = req.body.time_interval; //interval can be 10-3600

  /* function to send req to tcp client */
  console.log(device_id);

  let success_message = "SURE, I WILL!";
  let error_message = "VEHICLE IS NOT CONNECTED.";

  res
  .status(200)
  .json(success_message);

};
