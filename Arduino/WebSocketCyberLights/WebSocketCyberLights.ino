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

boolean isLedOn = false;
uint32_t low = strip.Color(0, 0, 0); 

int sliderValue = 255;
uint32_t high = strip.Color(sliderValue, sliderValue, sliderValue);


void setup() {
    strip.begin();
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

    WiFiMulti.addAP("Thunberg", "jonte2000");

    while(WiFiMulti.run() != WL_CONNECTED) {
        
        delay(100);
    }
    USE_SERIAL.println("Connected");

    
    webSocket.begin("192.168.1.213", 5000);
    webSocket.on("toggleOnOff", toggleOnOff);
    webSocket.on("changeSlider", changeSlider);
    webSocket.on("getCurrentButtonValueFromMCU", getCurrentButtonValueFromMCU);

}

void getCurrentButtonValueFromMCU(const char * payload, size_t length) {
  if (isLedOn == true) {
    webSocket.emit("isLedOn", "1");
  } else {
    webSocket.emit("isLedOn", "0");
  }
   
}

void toggleOnOff(const char * payload, size_t length) {
  USE_SERIAL.printf("got message: %s\n", payload);

 
    if (isLedOn == false) {
        for( int i = 0; i<LED_COUNT; i++){
          strip.setPixelColor(i, high);
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

void changeSlider(const char * payload, size_t length) {


    USE_SERIAL.printf(payload);
    USE_SERIAL.println();

    StaticJsonDocument<256> doc;
    deserializeJson(doc, payload, length);
    
    int brightness = doc["sliderValue"];

    
    
     USE_SERIAL.println(brightness);

    high = strip.Color(brightness, brightness, brightness);
 

    for( int i = 0; i<LED_COUNT; i++){
          strip.setPixelColor(i, high);
        }   
        strip.show();
  
}

void loop() {
    webSocket.loop();
}
