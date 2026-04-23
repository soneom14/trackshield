#include <SoftwareSerial.h>

SoftwareSerial gsm(2, 3);

void setup() {
  Serial.begin(9600);
  gsm.begin(9600);

  Serial.println("Testing SIM900A...");
}

void loop() {
  if (gsm.available()) {
    Serial.write(gsm.read());
  }

  if (Serial.available()) {
    gsm.write(Serial.read());
  }
}