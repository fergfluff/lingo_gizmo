//Meaning Maker Code
//Combining accelerometer as a sensor

#include "CurieIMU.h"

const int mouth0Sensor = A0;

void setup() {
  Serial.begin(9600);
  while (!Serial) ;
  //  while (Serial.available() <= 0) {
  //    Serial.println("hello");
  //    delay(300);
  pinMode(mouth0Sensor, INPUT);

  Serial.println("Initializing IMU device...");
  CurieIMU.begin();
  // Set the accelerometer range to 2G
  CurieIMU.setAccelerometerRange(2);
}

void loop() {
  //if (Serial.available() > 0) {

  //OTHER SENSORS CODE
  int mouthPressed = digitalRead(mouth0Sensor);

  //ACCELEROMETER CODE
  float ax, ay, az;   //scaled accelerometer values
  CurieIMU.readAccelerometerScaled(ax, ay, az);
  //Serial.print("a:\t");
  //Serial.println(ax);


  if (ax >= 0.50) {
    ax = 2;
    Serial.print("Mouth open:");
    Serial.print("\t");
    Serial.println(ax);
  } else if (ax < 0.49 && ax > -0.510) {
    ax = 1;
    Serial.print("Mouth halfway:");
    Serial.print("\t");
    Serial.println(ax);
  } else if (ax < -0.50) {
    ax = 0;
    Serial.print("Mouth closed:");
    Serial.print("\t");
    Serial.println(ax);
  }



  if (mouthPressed == LOW) {
    Serial.println("Mouth not pressed");
  }  else if (mouthPressed == HIGH) {
    Serial.println("Mouth PRESSED");
  }



  //NO SOUND
  if (mouthPressed == 0 && ax == 0) {
    Serial.println("consonants");
  } else if (mouthPressed == 0) {
  Serial.println("no sound");
    //LOW VOWELS
  } else if (mouthPressed == 1 && ax == 2) {
  Serial.println("low vowels list");
    //HIGH VOWELS
  } else if (mouthPressed == 1 && ax == 1) {
  Serial.println("high vowels list");
    //CLOSED MOUTH/CONSONANTS
  }

  delay(1000);
            }
