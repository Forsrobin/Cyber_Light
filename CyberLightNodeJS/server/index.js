var app = require('express')();
var server = app.listen(5000);
var io = require('socket.io').listen(server);





io.on('connection', function(socket){
  
    console.log("New client connected");





    // ====Button functions==== //
    // On Off
    socket.on("getCurrentButtonValue", () => {
        io.sockets.emit('getCurrentButtonValueFromMCU');
    });

    //Toggle on of
    socket.on("toggleOnOff", () => {
        console.log("Toggle");
        io.sockets.emit('toggleOnOff');
    });

    //IS led on
    socket.on("isLedOn", (data) => {
        io.sockets.emit('returnDataFromMCU', data);
    });
    




    // ====Slider functions==== //
    // Current slider value
    socket.on("getCurrentSliderValue", () => {
        io.sockets.emit('getCurrentSliderValueFromMCU');
    });

    //Get the slider values
    socket.on("getSlideValue", (data) => {
        io.sockets.emit('returnSliderDataFromMCU', data);
    });

    // Slider
    socket.on("changeSlider", (data) => {   
        console.log(data);     
        io.sockets.emit('changeSlider', data);
    });


    // =====Change color==== //
    socket.on("changeColor", (data) => {   
        console.log(data);     
        io.sockets.emit('changeColor', data);
    });


    socket.on("getColorArduinoCall", (data) => {
        io.sockets.emit('getColorArduino');
    });

    //Get the slider values
    socket.on("getColor", (data) => {
        io.sockets.emit('returnColorData', data);
    });




    //On disconnect
    socket.on('disconnect', function () {
        console.log("Client disconnected");
    });

});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});


  

