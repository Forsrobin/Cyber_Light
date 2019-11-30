var app = require('express')();
var server = app.listen(5000);
var io = require('socket.io').listen(server);


var devices = [];


io.on('connection', function(socket){
  
    console.log("New client connected");

    io.sockets.emit('storeDeviceInfoGet');
    
    socket.on('storeDeviceInfo', function (data) {

        devices.includes(data.customId)
        var found = devices.some(deviceInfo => deviceInfo.customId == data.customId);

        if (!found) {
            var deviceInfo = new Object();
            deviceInfo.customId = data.customId;
            deviceInfo.socketId = socket.id;
            deviceInfo.deviceType = data.deviceType;
            deviceInfo.name = data.name;
            deviceInfo.ip = data.ip;
            devices.push(deviceInfo);

            pushDevicesToAllDevices();

        };
        
    });

    socket.on('getConnectedDevices', (callback) => {
        callback(devices);
    });


    pushDevicesToAllDevices = () => {
        io.sockets.emit('pushDevicesToAllClients', devices);
        console.log("Pushing device info...");
        
    }
    


    // ====ToggleLedButton functions==== //

    //Toggle on off
    socket.on("clientToServerButton", () => {
        io.sockets.emit('serverToDeviceButton');
    });

    //Is led on
    socket.on("isLedOn", (data) => {
        io.sockets.emit('returnDataFromDevice', data);
    });
    
    // Get current
    socket.on("getCurrentButtonValue", () => {
        io.sockets.emit('getCurrentButtonValueFromDevice');
    });



    // ====Slider functions==== //
    
    // Client to Device
    socket.on("clientToServerSlider", (data) => {   
        socket.broadcast.emit('serverToDeviceSlider', data);
    });


    // Device to client
    socket.on("deviceToServerSlider", (data) => {
        socket.broadcast.emit('serverToClientsSlider', data);
    });

    // Device to client
    socket.on("getCurrentSliderValue", (data) => {
        socket.broadcast.emit('serverToClientsSlider', data);
    });




    // =====Change color==== //
    socket.on("changeColor", (data) => {   
        console.log(data);     
        io.sockets.emit('changeColor', data);
    });

    socket.on("getColorArduinoCall", (data) => {
        io.sockets.emit('getColorArduino');
    });

    socket.on("getColor", (data) => {
        io.sockets.emit('returnColorData', data);
    });




    //On disconnect
    socket.on('disconnect', function () {
        console.log("Client disconnected");

        for( var i=0, len=devices.length; i<len; ++i ){
            var c = devices[i];

            if(c.socketId == socket.id){
                devices.splice(i,1);
                break;
            }
        }
        pushDevicesToAllDevices();
    });

});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});


  

