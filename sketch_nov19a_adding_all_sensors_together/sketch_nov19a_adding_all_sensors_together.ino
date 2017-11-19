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
  if (ax >= 0.50) {
    ax = 2;
    //mouthOpen = ax;
    Serial.print("mouth open:");
    Serial.print("\t");
    Serial.println(ax);
  } else if (ax < 0.49 && ax > -0.510) {
    ax = 1;
    Serial.print("mouth halfway:");
    Serial.print("\t");
    Serial.println(ax);
  } else if (ax < -0.50) {
    ax = 0;
    Serial.print("mouth closed:");
    Serial.print("\t");
    Serial.println(ax);
  }


  //COMBINE SENSORS TO CREATE USEFUL VALUES
  //MOUTH SENSORS
  //Read mouth0Sensor to see if the mouth is pressed
  int mouthPressed = digitalRead(mouth0Sensor);
  if (mouthPressed == LOW) {
    mouthPressed = 0;
    Serial.print("no mouth pressed:");
    Serial.print("\t");
    Serial.println(mouthPressed);
  }  else if (mouthPressed == HIGH) {
    mouthPressed = 1;
    Serial.print("yes mouth pressed");
    Serial.print("\t");
    Serial.println(mouthPressed);
  }
  //Mouth is closed completely, consonants play (such as mah, pah, mah)
  if (mouthPressed == 0 && ax == 0) {
    //How do I store this into a new variable? Such as ClosedConsonants.
    //closedConsonants = 1;
    Serial.println("yes consonants");
    //Mouth is NOT pressed at all, no sounds play.
    //Mouth is pressed and mouth is open, low vowels play
  } else if (mouthPressed == 1 && ax == 2) {
    //lowVowels = 0;
    Serial.println("yes low vowels list");
    //Mouth is pressed and mouth is halfway open, high vowels play
  } else if (mouthPressed == 1 && ax == 1) {
    //highVowels = 0;
    Serial.println("yes high vowels list");
  }

  //TEETH SENSOR
  int teethPressed = analogRead(teeth3Sensor);
  if (teethPressed < 799) {
    teethPressed = 0;
    Serial.print("no teeth sound:");
    Serial.print("\t");
    Serial.println(teethPressed);
  } else if (teethPressed > 800) {
    teethPressed = 1;
    Serial.print("yes teeth sound:");
    Serial.print("\t");
    Serial.println(teethPressed);
  }

  //TONGUE SENSORS
  int tipTonguePressed = analogRead(tongue4Sensor);
  if (tipTonguePressed < 799) {
    tipTonguePressed = 0;
    Serial.print("no tip of tongue sounds:");
    Serial.print("\t");
    Serial.println(tipTonguePressed);
  } else if (tipTonguePressed > 800) {
    tipTonguePressed = 1;
    Serial.print("yes tip of tongue sounds:");
    Serial.print("\t");
    Serial.println(tipTonguePressed);
  }

  int middleTonguePressed = analogRead(tongue5Sensor);
  if (middleTonguePressed < 799) {
    middleTonguePressed = 0;
    Serial.print("no middle of tongue sounds:");
    Serial.print("\t");
    Serial.println(middleTonguePressed);
  } else if (middleTonguePressed > 800) {
    middleTonguePressed = 1;
    Serial.print("yes middle of tongue sounds:");
    Serial.print("\t");
    Serial.println(middleTonguePressed);
  }

  int backTonguePressed = analogRead(tongue6Sensor);
  if (backTonguePressed < 799) {
    backTonguePressed = 0;
    Serial.print("no back of tongue sounds:");
    Serial.print("\t");
    Serial.println(backTonguePressed);
  } else if (backTonguePressed > 800) {
    backTonguePressed = 1;
    Serial.print("yes back of tongue sounds:");
    Serial.print("\t");
    Serial.println(backTonguePressed);
  }

  Serial.println("-");
  Serial.println("-");

  //HOW DO I PRINT DATA IN A CLEAN LIST FOR SERIAL COMMUNICATION?
  //Serial.println[mouthPressed + teethPressed + tipTonguePressed + middleTonguePressed + backTonguePressed];

  //closedConsonants, noSound, lowVowels, highVowels,

  //  mouthPressed;
  //  closedConsonants;
  //  noSound;
  //  lowVowels;
  //  highVowels;
  //  teethPressed;
  //  tipTonguePressed;
  //  middleTonguePressed;
  //  backTonguePressed;

  delay(1000);
}
