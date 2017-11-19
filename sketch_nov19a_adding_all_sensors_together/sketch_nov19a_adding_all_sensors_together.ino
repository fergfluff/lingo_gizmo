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

  //Read mouth0Sensor to see if the mouth is pressed
  int mouthPressed = digitalRead(mouth0Sensor);
  //Map mouthPressed to off or on / 0 or 1
  //? Can I reassign different values ot the same variable? or needs to be different?
  if (mouthPressed == LOW) {
    //mouthNotPressed = 0;
    //mouthPressed = 0;
    Serial.println("Mouth not pressed");
  }  else if (mouthPressed == HIGH) {
    //mouthPressed = 1;
    Serial.println("Mouth PRESSED");
  }

  //Read the accelerometer's values
  float ax, ay, az;   //scaled accelerometer values
  CurieIMU.readAccelerometerScaled(ax, ay, az);

  // Map the x axis values of the accelerometer to three different positions of the mouth
  if (ax >= 0.50) {
    ax = 2;
    //mouthOpen = ax;
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


  //COMBINE SENSORS TO CREATE USEFUL VALUES


  //MOUTH SENSORS
  //Mouth is closed completely, consonants play (such as mah, pah, mah)
  if (mouthPressed == 0 && ax == 0) {
    //How do I store this into a new variable? Such as ClosedConsonants.
    //closedConsonants = 1;
    Serial.println("consonants");
    //Mouth is NOT pressed at all, no sounds play.
  } else if (mouthPressed == 0) {
    //noSound = 1;
    Serial.println("no sound");
    //Mouth is pressed and mouth is open, low vowels play
  } else if (mouthPressed == 1 && ax == 2) {
    //lowVowels = 0;
    Serial.println("low vowels list");
    //Mouth is pressed and mouth is halfway open, high vowels play
  } else if (mouthPressed == 1 && ax == 1) {
    //highVowels = 0;
    Serial.println("high vowels list");
  }

  //TEETH SENSOR
  int teethPressed = digitalRead(teeth3Sensor);
  if (teethPressed == LOW) {
    //teethPressed = 0;
    Serial.println("no teeth sound");
  } else if (teethPressed == HIGH) {
    //teethPressed = 1;
    Serial.println("teeth sound");
  }

  //TONGUE SENSORS
  int tipTonguePressed = digitalRead(tongue4Sensor);
  if (tipTonguePressed == LOW) {
    //tipTonguePressed = 0;
    Serial.println("no tip of tongue sounds");
  } else if (tipTonguePressed == HIGH) {
    //tipTonguePressed = 1;
    Serial.println("tip of tongue sounds");
  }

  int middleTonguePressed = digitalRead(tongue5Sensor);
  if (middleTonguePressed == LOW) {
    //middleTonguePressed = 0;
    Serial.println("no middle of tongue sounds");
  } else if (middleTonguePressed == HIGH) {
    //middleTonguePressed = 1;
    Serial.println("middle of tongue sounds");
  }

  int backTonguePressed = digitalRead(tongue6Sensor);
  if (backTonguePressed == LOW) {
    //backTonguePressed = 0;
    Serial.println("no back of tongue sounds");
  } else if (backTonguePressed == HIGH) {
    //backTonguePressed = 1;
    Serial.println("back of tongue sounds");
    Serial.print("");
    Serial.print("");
  }

  //HOW DO I PRINT DATA IN A CLEAN LIST FOR SERIAL COMMUNICATION?

  //Serial.println(mouthPressed, closedConsonants, noSound, lowVowels, highVowels, 
  //teethPressed, tipTonguePressed, middleTonguePressed, backTonguePressed);
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
