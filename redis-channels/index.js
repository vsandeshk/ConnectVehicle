
/*
* this function will set the user channel for particular vehicle by using its unique device id
* by this channel, the tcp server will send message to rest server (publish channel).
* by this channel, the rest server will receive the message from the tcp server (as subcribe)
*/
module.exports.getUserChannel = function(device_id) {

  return "user-channel-"+ device_id;

}


/*
* this function will set the vehicle channel for particular vehicle by using its unique device id
* by this channel, the rest server will send message to tcp server (publish channel).
* by this channel, the tcp server will receive the message from the rest server (as subcribe)
*/
module.exports.getVehicleChannel = function(device_id) {

  return "vehicle-channel-"+ device_id;

}
