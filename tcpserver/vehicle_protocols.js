const socket = require('net');

const login_regex = /^HELLO, I'M (.+)!$/;
const frequency_regex = /^KEEP ME POSTED EVERY (0*[1-9][0-9]*) SECONDS.$/;
const status_regex = /^REPORT. I'M HERE ([0-9]+(\.[0-9]+)?) ([0-9]+(\.[0-9]+)?), (RESTING|RUNNING) AND CHARGED AT ([0-9]+)%.$/;

var device_id;

 response_messages = {
  greet: "HI, NICE TO MEET YOU!",
  ping: "PONG.",
  status: "OK, THANKS!",
  unknown_message: "UNKOWN MESSAGE",
  unknown_device: "UNKNOWN DEVICE"
}

vehicle_status = {
  latitude: 0,
  longitude: 0,
  state: "",
  battery: 0
}

setDeviceId = function(message) {
  const [, id] = message.match(login_regex);
  device_id = id;
}

setVehicleStatus = function(message) {
  const [, latitude,, longitude,, state, battery] = message.match(status_regex);
  vehicle_status.latitude = parseFloat(latitude);
  vehicle_status.longitude = parseFloat(longitude);
  vehicle_status.state = state;
  vehicle_status.battery = parseFloat(battery);

  console.log(vehicle_status);
}

module.exports.getDeviceId = function() {
  return device_id;
}

module.exports.handleMessage = function(message) {
  if (device_id) {
    if (message === "PING.") {
      return response_messages.ping;
    } else if (status_regex.test(message)) {
      setVehicleStatus(message);
      return response_messages.status;
    } else {
        return response_messages.unknown_message;
    }
  } else if (login_regex.test(message)) {
    setDeviceId(message);
    return response_messages.greet;
  } else {
    return response_messages.unknown_device;
  }
}
