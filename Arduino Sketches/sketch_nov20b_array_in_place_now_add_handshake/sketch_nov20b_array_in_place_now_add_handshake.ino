//Meaning Maker Code
//Test if closing mouth all the way works as expected
//What to do if user presses two at the same time?

#include "CurieIMU.h"

//ANALOG SENSORS
//Combining these first two sensors results in 3 sensor combinations below
//(open, halfway, closed mouth)
//*const int accelerometer in Arduino 101
const int mouth0Sensor = A0;
const int teeth3Sensor = A1;
const int tongue4Sensor = A2;
const int tongue5Sensor = A3;
const int tongue6Sensor = A4;

int noSounds;
int closedConsonants;
int highVowels;
int lowVowels;




void setup() {
  Serial.begin(9600);
  while (!Serial) ;
  while (Serial.available() <= 0) {
    Serial.println("hello");
    delay(300);
    pinMode(mouth0Sensor, INPUT);

    //Serial.println("Initializing IMU device...");
    CurieIMU.begin();
    // Set the accelerometer range to 2G
    CurieIMU.setAccelerometerRange(2);
  }
}

void loop() {
  if (Serial.available() > 0) {
    //Where do I use this variable? No where yet.
    int inByte = Serial.read();

    //Read the accelerometer's values
    float ax, ay, az;   //scaled accelerometer values
    CurieIMU.readAccelerometerScaled(ax, ay, az);

    // Map the x axis values of the accelerometer to three different positions of the mouth
    if (ax >= .50) {
      //open mouth
      ax = 3;
    } else if (ax < 0.49 && ax > -0.510) {
      //halfway mouth
      ax = 2;
    } else if (ax < -0.50) {
      //closed mouth
      ax = 1;
    }

    //MOUTH SENSORS
    //Read mouth0Sensor to see if the mouth is pressed
    int mouthPressed = digitalRead(mouth0Sensor);
    if (mouthPressed == LOW) {
      mouthPressed = 0;
      Serial.print(mouthPressed);
      Serial.print(",");
    }  else if (mouthPressed == HIGH) {
      mouthPressed = 1;
      Serial.print(mouthPressed);
      Serial.print(",");
    }
    //No sounds if mouth is not pressed and mouth is halfway or open
    if (mouthPressed == 0 && ((ax == 2) || (ax == 3))) {
      noSounds = 0;
      Serial.print(noSounds);
      Serial.print(",");
      //Consonants if mouth is closed all the way
    } else if (mouthPressed == 0 && ax == 1) {
      closedConsonants = 1;
      Serial.print(closedConsonants);
      Serial.print(",");
      //Vowels if mouth pressed and halfway open
    } else if (mouthPressed == 1 && ax == 2) {
      highVowels = 2;
      Serial.print(highVowels);
      Serial.print(",");
      //Vowels if mouth pressed and open all the way
    } else if (mouthPressed == 1 && ax == 3) {
      lowVowels = 3;
      Serial.print(lowVowels);
      Serial.print(",");
    }
    //TEETH SENSOR
    //*****CHANGE TO ANALOG ONCE ATTACHED TO FABRIC
    int teethPressed = digitalRead(teeth3Sensor);
    if (teethPressed == LOW) {
      teethPressed = 0;
      Serial.print(teethPressed);
      Serial.print(",");
    } else if (teethPressed == HIGH) {
      teethPressed = 1;
      Serial.print(teethPressed);
      Serial.print(",");
    }
    //TONGUE SENSORS
    int tipTonguePressed = analogRead(tongue4Sensor);
    if (tipTonguePressed < 799) {
      tipTonguePressed = 0;
      Serial.print(tipTonguePressed);
      Serial.print(",");
    } else if (tipTonguePressed > 800) {
      tipTonguePressed = 1;
      Serial.print(tipTonguePressed);
      Serial.print(",");
    }
    int middleTonguePressed = analogRead(tongue5Sensor);
    if (middleTonguePressed < 799) {
      middleTonguePressed = 0;
      Serial.print(middleTonguePressed);
      Serial.print(",");
    } else if (middleTonguePressed > 800) {
      middleTonguePressed = 1;
      Serial.print(middleTonguePressed);
      Serial.print(",");
    }
    int backTonguePressed = analogRead(tongue6Sensor);
    if (backTonguePressed < 799) {
      backTonguePressed = 0;
      Serial.println(backTonguePressed);
    } else if (backTonguePressed > 800) {
      backTonguePressed = 1;
      Serial.println(backTonguePressed);
    }

    delay(200);
  }
}

//if (Serial.available() > 0) {
//    int inByte = Serial.read();
//    for (int i = 0; i < 3; i++) {
//      int sensorValue = analogRead(sensorPins[i]);
//      if (sensorValue > 900) {
//        Serial.print(1);
//      } else {
//        Serial.print(0);
//      }
//      if (i < 2) {
//        Serial.print(',');
//      }
//    }
//    Serial.println();
//  }
