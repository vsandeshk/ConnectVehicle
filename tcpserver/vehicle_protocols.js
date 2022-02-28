const socket = require('net');


/*
* These are the regular expressions to identifies some protocols
* THese also use to fetch data from message
*/
const login_regex = /^HELLO, I'M (.+)!$/;
const frequency_regex = /^KEEP ME POSTED EVERY (0*[1-9][0-9]*) SECONDS.$/;
const status_regex = /^REPORT. I'M HERE ([0-9]+(\.[0-9]+)?) ([0-9]+(\.[0-9]+)?), (RESTING|RUNNING) AND CHARGED AT ([0-9]+)%.$/;
const status_regex2 = /^FINE. I'M HERE ([0-9]+(\.[0-9]+)?) ([0-9]+(\.[0-9]+)?), (RESTING|RUNNING) AND CHARGED AT ([0-9]+)%.$/;

var device_id;

/*
* This object contains the message that tcp server will send to vehicle on some specific commads.
*/

 response_messages = {
  greet: "HI, NICE TO MEET YOU!",
  ping: "PONG.",
  status: "OK, THANKS!",
  unknown_message: "UNKOWN MESSAGE",
  unknown_device: "UNKNOWN DEVICE"
}

/*
* This method is use to get the status parameters from the vehicle
* the parameters will be fetched by using regex expressions
* the fetch parameters will be set to a object that will be send to rest server
*/
setVehicleStatus = function(message) {
  var vehicle_status = {};
  const [, latitude,, longitude,, state, battery] = message.match(status_regex2);
  vehicle_status.latitude = parseFloat(latitude);
  vehicle_status.longitude = parseFloat(longitude);
  vehicle_status.state = state;
  vehicle_status.battery = parseFloat(battery);

  return vehicle_status;

}


/*
* This message is use to handle all the messages received by the vehicle
* this also decides which message should send to rest server or which should just send to tcp to get response.
* decision will be based on some procotols and comparision message with simple string or a regular expressoin.
*/
module.exports.handleMessage = function(message, sock) {
  var obj = {type: "error", message: "Error Message!", data: {}};
  if (sock.device_id) {
    if (message === "PING.") {
      obj.type = "message";
      obj.message = response_messages.ping;
    } else if (status_regex.test(message)) {
      obj.type = "message";
      obj.message = response_messages.status;
    } else if (status_regex2.test(message)) {
      obj.type = "data";
      obj.data = setVehicleStatus(message)
      obj.message = message;
    } else if (message === "SURE, I WILL!" || message === "DONE!" || message === "I CAN'T, SORRY.") {
      obj.type = "data";
      obj.data = {message: message};
      obj.message = message;
    } else {
      obj.type = "message";
      obj.message = response_messages.unknown_message;
    }
  } else if (login_regex.test(message)) {
    obj.type = "message";
    obj.message = response_messages.greet;
    setDeviceId(message, sock);
  } else {
    obj.type = "message";
    obj.message = response_messages.unknown_device;
  }
  return obj;
}
