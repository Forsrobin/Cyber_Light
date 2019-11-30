#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <Adafruit_NeoPixel.h>
#include <SocketIoClient.h>
#include <ArduinoJson.h>


#define USE_SERIAL Serial

#define LED_PIN    5
 
// How many NeoPixels are attached to the Arduino?
#define LED_COUNT 60
 
// Declare our NeoPixel strip object:
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;

boolean isLedOn = true;
uint32_t low = strip.Color(0, 0, 0); 

int sliderValue = 255;
uint32_t high = strip.Color(sliderValue, sliderValue, sliderValue);

//Välj användare Thun = [0], Fors = [1]
int user = 0;


//INKLUDERA VÅRA FUNKTIONER
#include "functionsCyberLight.h"

void setup() {
    strip.begin();
    strip.setBrightness(brightness);
    for( int i = 0; i<LED_COUNT; i++){
      strip.setPixelColor(i, (r), (g), (b));
    }       
    strip.show(); // Initialize all pixels to 'off'
    
  
    
    USE_SERIAL.begin(115200);

    USE_SERIAL.setDebugOutput(true);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

      for(uint8_t t = 4; t > 0; t--) {
          USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
          USE_SERIAL.flush();
          delay(1000);
      }

    
    if(user == 0) {
      WiFiMulti.addAP("Thunberg", "jonte2000");
    } else {
      WiFiMulti.addAP("Rosenborg");
    }

    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }

    if(user == 0) {
      webSocket.begin("192.168.1.213", 5000);
    } else {
      webSocket.begin("192.168.1.132", 5000);
    }

  

    //DeviceInfo
    webSocket.on("storeDeviceInfoGet", storeDeviceInfoGet);
     
    //Button
    webSocket.on("serverToDeviceButton", serverToDeviceButton);
    webSocket.on("getCurrentButtonValueFromDevice", getCurrentButtonValueFromDevice);

    //Slider
    webSocket.on("serverToDeviceSlider", serverToDeviceSlider);
    webSocket.on("getCurrentSliderValueFromDevice", getCurrentSliderValueFromDevice);

    //Color
    webSocket.on("changeColor", changeColor);
    webSocket.on("getColorArduino", getColorValue);

    webSocket.on("useFunction", getLightDisplayFunction);
    
}

//DeviceInfo
void storeDeviceInfoGet(const char * payload, size_t length) {
    String ipString = WiFi.localIP().toString();
    webSocket.emit("storeDeviceInfo", ("{\"deviceType\":\"01\", \"customId\":\"01\", \"name\":\"CyberCoo\", \"ip\":\""+ipString+"\"}").c_str());
}


//Get display funktion
void getLightDisplayFunction(const char * payload, size_t length) {

    //Ta ut alla argument
    StaticJsonDocument<256> doc;
    deserializeJson(doc, payload, length);
    
    switch (doc["function"]) {
      case "static":
        // statements
        staticLight(doc["data"]);
        
        break;
      case "rave":
        // statements
        break;
      default:
        // statements
      break;
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


//Slider
void serverToDeviceSlider(const char * payload, size_t length) {

    changeSlider(payload, length);
    USE_SERIAL.println(brightness);
    webSocket.emit("deviceToServerSlider",  ("\""+String(brightness)+"\" ").c_str());
}


void changeSlider(const char * payload, size_t length) {
    StaticJsonDocument<256> doc;
    deserializeJson(doc, payload, length);
    
    brightness = doc["sliderValue"];
    
    USE_SERIAL.println(brightness);
    strip.setBrightness(brightness);
    strip.show();
}

void getCurrentSliderValueFromDevice(const char * payload, size_t length) {
    webSocket.emit("deviceToServerSlider", ("\""+String(brightness)+"\" ").c_str());
}


//Color
void getColorValue(const char * payload, size_t length) {
    Serial.print(hex_color);
  
    webSocket.emit("getColor", ("\""+String(hex_color)+"\" ").c_str() );
}

void changeColor(const char * payload, size_t length) {

    staticLight(payload);
    
}

//Loop
void loop() {
    webSocket.loop();
}
