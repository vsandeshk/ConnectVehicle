const socket = require('net');

const login_regex = /^HELLO, I'M (.+)!$/;
const frequency_regex = /^KEEP ME POSTED EVERY (0*[1-9][0-9]*) SECONDS.$/;
const status_regex = /^REPORT. I'M HERE ([0-9]+(\.[0-9]+)?) ([0-9]+(\.[0-9]+)?), (RESTING|RUNNING) AND CHARGED AT ([0-9]+)%.$/;
const status_regex2 = /^FINE. I'M HERE ([0-9]+(\.[0-9]+)?) ([0-9]+(\.[0-9]+)?), (RESTING|RUNNING) AND CHARGED AT ([0-9]+)%.$/;

var device_id;

 response_messages = {
  greet: "HI, NICE TO MEET YOU!",
  ping: "PONG.",
  status: "OK, THANKS!",
  unknown_message: "UNKOWN MESSAGE",
  unknown_device: "UNKNOWN DEVICE"
}

setDeviceId = function(message, sock) {
  const [, id] = message.match(login_regex);
  sock.device_id = id;
}

getDeviceId = function(message) {
  return device_id;
}

setVehicleStatus = function(message) {
  var vehicle_status = {};
  const [, latitude,, longitude,, state, battery] = message.match(status_regex2);
  vehicle_status.latitude = parseFloat(latitude);
  vehicle_status.longitude = parseFloat(longitude);
  vehicle_status.state = state;
  vehicle_status.battery = parseFloat(battery);

  return vehicle_status;

}

module.exports.getDeviceId = function() {
  return device_id;
}

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
    } else if (message === "SURE, I WILL!") {
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
