// functionsCyberLight.h

#ifndef _FUNCTIONSCYBERLIGHT_H    
#define _FUNCTIONSCYBERLIGHT_H  


//DEFAULT VARABLES
int brightness = 255;

String hex_color = "#ffffff";

int r = 255;
int g = 255;
int b = 255;

void staticLight(const char * color) {
  
    hex_color = "#" + String(color);
    
    long number = (long) strtol( &color[0], NULL, 16);
    r = number >> 16;
    g = number >> 8 & 0xFF;
    b = number & 0xFF;
    
    for( int i = 0; i<LED_COUNT; i++){
      strip.setPixelColor(i, (r), (g), (b));
    }   
    strip.show();
}

#endif // _FUNCTIONSCYBERLIGHT_H    // Put this line at the end of your file.
