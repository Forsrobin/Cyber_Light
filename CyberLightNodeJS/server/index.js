var app = require('express')();
var server = app.listen(5000);
var io = require('socket.io').listen(server);


var devices = [];
var clients = [];

io.on('connection', function(socket){
  
    

    io.sockets.emit('storeDeviceInfoGet');

    io.sockets.emit('storeClientInfoGet');

    socket.on('storeClientInfo', (data) => {
        clients.push(socket);
    });
    
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

            console.log(data.name+" connected");
            

            pushDevicesToAllDevices();

        };
        
    });

    // Callback device array to client when asked
    socket.on('getConnectedDevices', (callback) => {
        callback(devices);
    });

     // Push device array to all clients   
    pushDevicesToAllDevices = () => {
        io.sockets.emit('pushDevicesToAllClients', devices);
        console.log("Pushing device info...");
        
    }


    //Interupt function
    socket.on("interuptFunction", (data) => {
        console.log("I recived an interupt!");
        // Server to device communication 
        io.to(data["deviceSocketId"]).emit('interuptFunction', data); 
    });



    // Client to server communication
    socket.on("useFunctionFromClient", (data) => {     
        // Server to device communication 
        io.to(data["deviceSocketId"]).emit('useFunction', data); 
    });

    // Device to server communication
    socket.on("useFunctionFromDevice", (data) => {  

        console.log(data);

        if (data['iniBool'] == 0) {
            for(var i = 0; i < clients.length; i++) {
                if(clients[i].id != data["clientSocketId"]) {     
                // Server to client communication            
                io.to(clients[i].id).emit(data["function"]+'PushDataToClients', data);
                }
            }
        } else {
            for(var i = 0; i < clients.length; i++) {      
                // Server to client communication           
                io.to(clients[i].id).emit(data["function"]+'PushDataToClients', data);
            }
        }

    });




    //On disconnect
    socket.on('disconnect', function () {
     

        for( var i=0, len=devices.length; i<len; ++i ){
            var c = devices[i];

            if(c.socketId == socket.id){
                console.log(devices[i].name+" diconnected");
                
                devices.splice(i,1);
                clients.splice(i,1);
                break;
            }
        }
        pushDevicesToAllDevices();
    });

});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});


  

