  // functionsCyberLight.h
  
  #ifndef _FUNCTIONSCYBERLIGHT_H    
  #define _FUNCTIONSCYBERLIGHT_H  
  
  
  //DEFAULT VARABLES
  int brightness = 255;
  
  String hex_color = "#ffffff";
  
  int r = 255;
  int g = 0;
  int b = 0;
  
  void color(const char * payload, size_t length) {
  
    //Deserialize json
    StaticJsonDocument<256> doc;
    deserializeJson(doc, payload, length);

    
    if (doc["type"] == "set") {
      
        String color = doc["data"]["color"];
        
        hex_color = "#" + color;
        
        long number = (long) strtol( &color[0], NULL, 16);
        r = number >> 16;
        g = number >> 8 & 0xFF;
        b = number & 0xFF;
        
        if (isLedOn == true) {
          for( int i = 0; i<LED_COUNT; i++){
            strip.setPixelColor(i, (r), (g), (b));
          }   
          strip.show();
        }
     
        
    } else if (doc["type"] == "get")  {
      String socket_id = doc["clientSocketId"];
      String iniBool = doc["iniBool"];
      
      webSocket.emit("useFunctionFromDevice", ("{\"function\":\"color\", \"clientSocketId\":\""+socket_id+"\", \"iniBool\":\""+iniBool+"\", \"data\":{\"hex_color\":\""+hex_color+"\"}}").c_str());
    }
      
  
  }
  
  void switchOnOff(const char * payload, size_t length) {

     //Deserialize json
    StaticJsonDocument<256> doc;
    deserializeJson(doc, payload, length);

   
   if (doc["type"] == "set") {
      
        if (isLedOn == false) {
        for( int i = 0; i<LED_COUNT; i++){
          strip.setPixelColor(i, (r), (g), (b));
         }   
         strip.show();
         isLedOn = true;
      } else  {
        for( int i = 0; i<LED_COUNT; i++){
          strip.setPixelColor(i, low);
        }   
        strip.show();
        isLedOn = false;
      }
        
    } else if (doc["type"] == "get")  {
      String socket_id = doc["clientSocketId"];
      String iniBool = doc["iniBool"];
      
      webSocket.emit("useFunctionFromDevice", ("{\"function\":\"switchOnOff\", \"clientSocketId\":\""+socket_id+"\", \"iniBool\":\""+iniBool+"\", \"data\":{\"newState\":\""+isLedOn+"\"}}").c_str());
    }
  }

   void brightnessChange(const char * payload, size_t length) {
  
    //Deserialize json
    StaticJsonDocument<256> doc;
    deserializeJson(doc, payload, length);

    
    if (doc["type"] == "set") {
      
      brightness = doc["data"]["brightnessValue"];
      
      strip.setBrightness(brightness);
      strip.show();
        
    } else if (doc["type"] == "get")  {
      String socket_id = doc["clientSocketId"];
      String iniBool = doc["iniBool"];
      
      webSocket.emit("useFunctionFromDevice", ("{\"function\":\"brightness\", \"clientSocketId\":\""+socket_id+"\", \"iniBool\":\""+iniBool+"\", \"data\":{\"brightness_value\":\""+brightness+"\"}}").c_str());
    }
      
  
  }
  
  #endif // _FUNCTIONSCYBERLIGHT_H    // Put this line at the end of your file.
