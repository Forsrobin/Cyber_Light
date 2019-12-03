// effecstCyberLight.h

#ifndef _EFFECTSCYBERLIGHT_H    
#define _EFFECTSCYBERLIGHT_H  

void setAll(byte red, byte green, byte blue) {
  for(int i = 0; i < LED_COUNT; i++ ) {
    strip.setPixelColor(i, red, green, blue);
  }
  strip.show();
}


void rainbowLoop(const char * payload, size_t length) {

  //Deserialize json
  StaticJsonDocument<256> doc;
  deserializeJson(doc, payload, length);

  int wait = doc["data"]["speed"];
  
  for(long firstPixelHue = 0; firstPixelHue < 3*65536; firstPixelHue += 256) {
    for(int i=0; i<strip.numPixels(); i++) { // For each pixel in strip...
      int pixelHue = firstPixelHue + (i * 65536L / strip.numPixels());
      strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));
    }
    strip.show(); // Update strip with new contents
    delay(wait);  // Pause for a moment
  }
}

void theaterChase(const char * payload, size_t length) {

  //Deserialize json
  StaticJsonDocument<256> doc;
  deserializeJson(doc, payload, length);

  int wait = doc["data"]["speed"];

  for(int a=0; a<10; a++) { 
    for(int b=0; b<3; b++) { 
      strip.clear();         

      for(int c=b; c<strip.numPixels(); c += 3) {
        strip.setPixelColor(c, (r), (g), (b));
      }
      strip.show(); 
      delay(wait);  
    }
  }
}

void staticColor(const char * payload, size_t length) {

  for( int i = 0; i<LED_COUNT; i++){
      strip.setPixelColor(i, (r), (g), (b));
  }
  strip.show();

}

void raveMode(const char * payload, size_t length) {

  for(int j = 0; j < 100; j++) {
        for( int i = 0; i<LED_COUNT; i++){
        strip.setPixelColor(i, (255), (0), (0));
        }
        strip.show();
      
        delay(10);
        
        for( int i = 0; i<LED_COUNT; i++){
            strip.setPixelColor(i, (0), (255), (0));
        }
        strip.show();
        delay(10);
        
  
        for( int i = 0; i<LED_COUNT; i++){
            strip.setPixelColor(i, (0), (0), (255));
        }
        strip.show();
        delay(10); 
  }

}

void FadeInOut(byte red, byte green, byte blue){
  float r, g, b;
     
  for(int k = 0; k < 256; k=k+1) {
    r = (k/256.0)*red;
    g = (k/256.0)*green;
    b = (k/256.0)*blue;
    setAll(r,g,b);
    strip.show();
  }
     
  for(int k = 255; k >= 0; k=k-2) {
    r = (k/256.0)*red;
    g = (k/256.0)*green;
    b = (k/256.0)*blue;
    setAll(r,g,b);
    strip.show();
  }
}









#endif // _EFFECTSCYBERLIGHT_H    // Put this line at the end of your file.
