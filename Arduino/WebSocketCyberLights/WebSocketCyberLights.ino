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

//Välj användare Thun = [0], Fors = [1]
int user = 1;

int brightness = 255;

String hex_color;
int r = 255;
int g = 255;
int b = 255;

void setup() {
    strip.begin();
    strip.setBrightness(brightness);
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
    USE_SERIAL.println("Connected");

    if(user == 0) {
      webSocket.begin("192.168.1.213", 5000);
    } else {
      webSocket.begin("192.168.1.132", 5000);
    }
    
    webSocket.on("toggleOnOff", toggleOnOff);
    webSocket.on("changeSlider", changeSlider);
    webSocket.on("getCurrentButtonValueFromMCU", getCurrentButtonValueFromMCU);
    webSocket.on("getCurrentSliderValueFromMCU", getCurrentSliderValueFromMCU);
    webSocket.on("changeColor", changeColor);
    webSocket.on("getColorArduino", getColorValue);

}

void getColorValue(const char * payload, size_t length) {

    Serial.print(hex_color);
  
    int test = 1000;
    webSocket.emit("getColor", ("\""+String(hex_color)+"\" ").c_str() );
}

void getCurrentButtonValueFromMCU(const char * payload, size_t length) {
  if (isLedOn == true) {
    webSocket.emit("isLedOn", "1");
  } else {
    webSocket.emit("isLedOn", "0");
  }
   
}

void changeColor(const char * payload, size_t length) {

    Serial.print(payload);

    hex_color = "#" + String(payload);
    
    long number = (long) strtol( &payload[0], NULL, 16);
    r = number >> 16;
    g = number >> 8 & 0xFF;
    b = number & 0xFF;

    Serial.print("red is ");
    Serial.println(r);
    Serial.print("green is ");
    Serial.println(g);
    Serial.print("blue is ");
    Serial.println(b);
    
    for( int i = 0; i<LED_COUNT; i++){
      strip.setPixelColor(i, (r), (g), (b));
    }   
    strip.show();
}

void getCurrentSliderValueFromMCU(const char * payload, size_t length) {
    USE_SERIAL.println(brightness);
    webSocket.emit("getSlideValue",  ("\""+String(brightness)+"\" ").c_str() );
}

void toggleOnOff(const char * payload, size_t length) {

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

void changeSlider(const char * payload, size_t length) {


    USE_SERIAL.printf(payload);
    USE_SERIAL.println();

    StaticJsonDocument<256> doc;
    deserializeJson(doc, payload, length);
    
    brightness = doc["sliderValue"];

    
    
    USE_SERIAL.println(brightness);
    strip.setBrightness(brightness);
    strip.show();

}

void loop() {
    webSocket.loop();
}
