const int sensorPins[] = {A0, A1, A2};

void setup() {
  Serial.begin(9600);
  while (Serial.available() <= 0) {
    Serial.println("hello");
    delay(300);
  }
}

void loop() {
  if (Serial.available() > 0) {
    int inByte = Serial.read();

    for (int i = 0; i < 3; i++) {
      int sensorValue = analogRead(sensorPins[i]);
      if (sensorValue > 900) {
        Serial.print(1);
      } else {
        Serial.print(0);
      }

      if (i < 2) {
        Serial.print(',');
      }
    }

    Serial.println();
  }
}

