const int mouth0Sensor = A0;
const int mouth1Sensor = A1;
const int mouth2Sensor = A2;
const int teeth3Sensor = A3;
const int teeth4Sensor = A4;
const int tongue5Sensor = A5;
const int tongue6Sensor = A6;
const int tongue7Sensor = A7;
const int mouth4Sensor = A10;



void setup() {
  Serial.begin(9600);

}

void loop() {

  int mouth0Pressed = analogRead(mouth0Sensor);
  //    Serial.print(mouth0Pressed);
  //    Serial.print(",");

  if (mouth0Pressed < 475) {
    mouth0Pressed = 0;
    Serial.print(mouth0Pressed);
    Serial.print(",");
  }  else if (mouth0Pressed > 475) {
    mouth0Pressed = 1;
    Serial.print(mouth0Pressed);
    Serial.print(",");
  }

  //Above 900
  int mouth1Pressed = analogRead(mouth1Sensor);
  //  Serial.print(mouth1Pressed);
  //  Serial.print(",");

  if (mouth1Pressed < 850) {
    mouth1Pressed = 0;
    Serial.print(mouth1Pressed);
    Serial.print(",");
  }  else if (mouth1Pressed > 850) {
    mouth1Pressed = 1;
    Serial.print(mouth1Pressed);
    Serial.print(",");
  }

  //Above 900
  int mouth2Pressed = analogRead(mouth2Sensor);
  //  Serial.print(mouth2Pressed);
  //  Serial.print(",");

  if (mouth2Pressed < 900) {
    mouth2Pressed = 0;
    Serial.print(mouth2Pressed);
    Serial.print(",");
  }  else if (mouth2Pressed > 900) {
    mouth2Pressed = 1;
    Serial.print(mouth2Pressed);
    Serial.print(",");
  }

  int teeth3Pressed = analogRead(teeth3Sensor);
  //  Serial.print(teeth3Pressed);
  //  Serial.print(",");

  if (teeth3Pressed < 825) {
    teeth3Pressed = 0;
    Serial.print(teeth3Pressed);
    Serial.print(",");
  }  else if (teeth3Pressed > 825) {
    teeth3Pressed = 1;
    Serial.print(teeth3Pressed);
    Serial.print(",");
  }

  int teeth4Pressed = analogRead(teeth4Sensor);
  //  Serial.print(teeth4Pressed);
  //  Serial.print(",");

  if (teeth4Pressed < 1000) {
    teeth4Pressed = 0;
    Serial.print(teeth4Pressed);
    Serial.print(",");
  }  else if (teeth4Pressed > 1000) {
    teeth4Pressed = 1;
    Serial.print(teeth4Pressed);
    Serial.print(",");
  }


  //Above 1
  int tongue5Pressed = analogRead(tongue5Sensor);
  //  Serial.print(tongue5Pressed);
  //  Serial.print(",");

  if (tongue5Pressed < 1) {
    tongue5Pressed = 0;
    Serial.print(tongue5Pressed);
    Serial.print(",");
  }  else if (tongue5Pressed > 1) {
    tongue5Pressed = 1;
    Serial.print(tongue5Pressed);
    Serial.print(",");
  }

  //Above 1
  int tongue6Pressed = analogRead(tongue6Sensor);
  //  Serial.print(tongue6Pressed);
  //  Serial.print(",");

  if (tongue6Pressed < 200) {
    tongue6Pressed = 0;
    Serial.print(tongue6Pressed);
    Serial.print(",");
  }  else if (tongue6Pressed > 200) {
    tongue6Pressed = 1;
    Serial.print(tongue6Pressed);
    Serial.print(",");
  }


  //Above 1
  int tongue7Pressed = analogRead(tongue7Sensor);
  //  Serial.print(tongue7Pressed);
  //  Serial.println("");

  if (tongue7Pressed < 150) {
    tongue7Pressed = 0;
    Serial.print(tongue7Pressed);
    Serial.print(",");
  }  else if (tongue7Pressed > 150) {
    tongue7Pressed = 1;
    Serial.print(tongue7Pressed);
    Serial.print(",");
  }

  int mouth4Pressed = analogRead(mouth4Sensor);
//  Serial.print(mouth4Pressed);
//  Serial.println("");
  
  if (mouth4Pressed <= 360) {
    //open mouth
    mouth4Pressed = 0;
    Serial.print(mouth4Pressed);
    Serial.println("");
  } else if (mouth4Pressed >= 361) {
    //closed mouth
    mouth4Pressed = 1;
    Serial.print(mouth4Pressed);
    Serial.println("");
  }


  delay(200);
}
