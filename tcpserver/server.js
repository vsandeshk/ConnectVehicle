const net = require('net');
const port = 8080;
const host = "127.0.0.1";
const protocols = require('./vehicle_protocols');
const redis_channels = require('./../redis-channels');
const redis = require('redis');
const redis_sub_instance = redis.createClient();
redis_sub_instance.connect();


//create tcp server
const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port +'.');
});

let sockets = [];

//write on socket
writeOnStream = function(sock, message) {
  sock.write(message+"\n");
}

/*
* This method is to subscribe vehicle using its unique id.
* This method will receive messages from rest server using redis pub/sub.
*/
subscribeVehicleChannel = async function(sock) {
  let channel_name =  redis_channels.getVehicleChannel(sock.device_id);

  redis_sub_instance.subscribe(channel_name, (message) => {

    let obj = JSON.parse(message);
    sock.subscribe_channel = true;
    writeOnStream(sock, obj.message);

  });
}

/*
* This method is to publish vehicle.
* This method will send messages to rest server using redis pub/sub.
*/
publishUserChannel = async function(obj) {
  redis_instance = redis.createClient();
  await redis_instance.connect();
  let channel_name = redis_channels.getUserChannel(obj.device_id);
  let message = JSON.stringify(obj);

  redis_instance.publish(channel_name, message);

}

/*
* this method is use to connect client to tcp server
* this is use whenever a device will connect to tcp server
*/
server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    /*
    * this sock.on() method is use to receive data from vehicle via socket
    * this is use whenever a device will connect to tcp server
    */
    sock.on('data', function(data) {
        let message = data.toString().trim();
        let response = protocols.handleMessage(message, sock);
        if (sock.device_id && !sock.subscribe_channel) {
          subscribeVehicleChannel(sock);
        }
        if (response.type === "message") {
          writeOnStream(sock, response.message);
        } else if (response.type === "data") {
          response.data.device_id=sock.device_id;
          publishUserChannel(response.data);
        }

    });

    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });


});
