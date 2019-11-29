var app = require('express')();
var server = app.listen(5000);
var io = require('socket.io').listen(server);





io.on('connection', function(socket){
  
    console.log("New client connected");

    // On Off
    socket.on("getCurrentButtonValue", () => {
        io.sockets.emit('getCurrentButtonValueFromMCU');
    });

    socket.on("toggleOnOff", () => {
        console.log("Toggle");
        
        io.sockets.emit('toggleOnOff');
        
    });

    socket.on("isLedOn", (data) => {
        
       
        io.sockets.emit('returnDataFromMCU', data);
        
    });
    

    // Slider
    socket.on("changeSlider", (data) => {        
        io.sockets.emit('changeSlider', data);
        console.log(data);
    });



    //On disconnect
    socket.on('disconnect', function () {

        console.log("Client disconnected");
        
        
    });
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});


  

