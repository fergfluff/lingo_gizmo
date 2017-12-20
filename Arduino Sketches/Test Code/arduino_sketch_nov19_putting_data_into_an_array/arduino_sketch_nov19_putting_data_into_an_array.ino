//Deal with what happens when a user presses two together - feedback message? no sound?
//Do I need "no sound" value reading?

//Meaning Maker Code
//Combining accelerometer as a sensor

#include "CurieIMU.h"

//Note: the accelerometer in Arduino 101 combined with mouth0Sensor
//allows for three "sensors".
//1) accelerometer (pointing up for mouth open vowels) + mouth0Sensor
//2) accelerometer (pointing halfway for halfway open vowels)  + mouth0Sensor
//3) accelerometer (pointing down for mouth closed consonants) -/without mouth0Sensor
const int mouth0Sensor = A0;
const int teeth3Sensor = A1;
const int tongue4Sensor = A2;
const int tongue5Sensor = A3;
const int tongue6Sensor = A4;

int closedConsonants;
int highVowels;
int lowVowels;




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



  //Read the accelerometer's values
  float ax, ay, az;   //scaled accelerometer values
  CurieIMU.readAccelerometerScaled(ax, ay, az);

  // Map the x axis values of the accelerometer to three different positions of the mouth
  if (ax >= .50) {
    ax = 2;
  } else if (ax < 0.49 && ax > -0.510) {
    ax = 1;
  } else if (ax < -0.50) {
    ax = 0;
  }


  //COMBINE SENSORS TO CREATE USEFUL VALUES
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
  //Mouth is closed completely, consonants play (such as mah, pah, mah)
  if (mouthPressed == 0 && ax == 0) {
    closedConsonants = 0;
    Serial.print(closedConsonants);
    Serial.print(",");
  } else if (mouthPressed == 1 && ax == 1) {
    highVowels = 1;
    Serial.print(highVowels);
    Serial.print(",");
  } else if (mouthPressed == 1 && ax == 2) {
    lowVowels = 2;
    Serial.print(lowVowels);
    Serial.print(",");
  }

  //TEETH SENSOR
  //CHANGE TO ANALOG ONCE ATTACHED TO FABRIC
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
    Serial.print(backTonguePressed);
    Serial.print(",");
  } else if (backTonguePressed > 800) {
    backTonguePressed = 1;
    Serial.println(backTonguePressed);
  }

  Serial.println("");
  Serial.println("-");


  delay(2000);
}
