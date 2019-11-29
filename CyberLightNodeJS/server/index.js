var app = require('express')();
var server = app.listen(5000);
var io = require('socket.io').listen(server);





io.on('connection', function(socket){
  
    console.log("New client connected");






    

    socket.on("toggleOnOff", () => {
        console.log("Toggle");
        
        io.sockets.emit('toggleOnOff');
        
        
    });

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


  

