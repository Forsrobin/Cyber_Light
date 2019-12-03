  #include <Arduino.h>
  #include <ESP8266WiFi.h>
  #include <ESP8266WiFiMulti.h>
  #include <Adafruit_NeoPixel.h>
  #include <SocketIoClient.h>
  #include <ArduinoJson.h>

  #include <DNSServer.h>
  #include <ESP8266WebServer.h>
  #include <WiFiManager.h>  

  #define DEVICENAME    String("Led Strip")
  #define DEVICEGROUP   String("1")
  #define DEVICEID      String("1")
  
  #define LED_PIN    5
  #define LED_COUNT 30
   
  Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);
  ESP8266WiFiMulti WiFiMulti;
  SocketIoClient webSocket;
  
  boolean isLedOn = true;
  uint32_t low = strip.Color(0, 0, 0); 
  bool effectRunning = false;
  
  //Välj användare Thun = [0], Fors = [1]
  int user = 1;
  
  //INKLUDERA VÅRA FUNKTIONER
  #include "functionsCyberLight.h"
  #include "effectsCyberLight.h"
  
  void setup() {
    
      strip.begin();

      //Startup animation
      
      strip.setBrightness(brightness);
      for( int i = 0; i<LED_COUNT; i++){
        strip.setPixelColor(i, (r), (g), (b));
        strip.show();
        delay(10);
      }

      strip.setBrightness(brightness);
      for( int i = 0; i<LED_COUNT; i++){
        strip.setPixelColor(i, (0), (0), (0));
        strip.show();
        delay(10);
      }
      
    
      
      Serial.begin(115200);
  
      Serial.setDebugOutput(false);
  
      for(uint8_t t = 4; t > 0; t--) {
          Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
          Serial.flush();
          delay(1000);
      }
  
      
      WiFiManager wifiManager;
      wifiManager.autoConnect("AutoConnectAP");

      //Sätt strip till grön om du får en koppling till sevrern
      for( int i = 0; i<LED_COUNT; i++){
        strip.setPixelColor(i, (0), (255), (0));
      }
      strip.show();
  
      if(user == 0) {
        webSocket.begin("192.168.1.213", 5000);
      } else {
        webSocket.begin("192.168.1.207", 5000);
      }
  
    
      //DeviceInfo
      webSocket.on("storeDeviceInfoGet", storeDeviceInfoGet);
      webSocket.on("useFunction", useFunction);
      webSocket.on("interuptFunction", interupFunction);

      
  }
  
  //DeviceInfo
  void storeDeviceInfoGet(const char * payload, size_t length) {
      String ipString = WiFi.localIP().toString();
      webSocket.emit("storeDeviceInfo", ("{\"deviceType\":\""+DEVICEGROUP+"\", \"customId\":\""+DEVICEID+"\", \"name\":\""+DEVICENAME+"\", \"ip\":\""+ipString+"\"}").c_str());
  }
  
  void interupFunction(const char * payload, size_t length) {
    Serial.println("I recived an interupt!");
    effectRunning = false;
  }
  
  //Get display funktion
  void useFunction(const char * payload, size_t length) {
  
      //Ta ut alla argument
      StaticJsonDocument<256> doc;
      deserializeJson(doc, payload, length);
  
      String function = doc["function"];


  
      if (function == "color") {
        
        color(payload, length);
        
      } else if  (function == "switchOnOff") {
        
        switchOnOff(payload, length);
        
      } else if  (function == "brightness") {
        
        brightnessChange(payload, length);
        
      } else if  (function == "rainbow") {
        
        rainbowLoop(payload, length);
        
      } else if  (function == "theaterChase") {
        
        theaterChase(payload, length);
        
      } else if  (function == "staticColor") {
        
        staticColor(payload, length);
        
      } else if  (function == "raveMode") {
        
        raveMode(payload, length);
        
      }
          
  }
  
  //Button 
  void serverToDeviceButton(const char * payload, size_t length) {
  
  
     
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
  }
  
  void getCurrentButtonValueFromDevice(const char * payload, size_t length) {
    if (isLedOn == true) {
      webSocket.emit("deviceToServerButton", "1");
    } else {
      webSocket.emit("deviceToServerButton", "0");
    }
     
  }
  
   
  
  //Color
  void getColorValue(const char * payload, size_t length) {
      Serial.print(hex_color);
    
      webSocket.emit("getColor", ("\""+String(hex_color)+"\" ").c_str() );
  }
  
  
  //Loop
  void loop() {
      webSocket.loop();
  }
