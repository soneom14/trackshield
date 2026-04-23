#include <SoftwareSerial.h>

SoftwareSerial gsm(2, 3); // RX, TX

String bandId = "TS-1001";

void setup() {
  Serial.begin(9600);
  gsm.begin(9600);

  delay(3000);

  Serial.println("Starting...");
}

void loop() {
  sendLocation();
  delay(15000);
}

void sendLocation() {
  String lat = "18.5204";
  String lng = "73.8567";

  String data = "bandId=" + bandId + "&lat=" + lat + "&lng=" + lng;

  sendCommand("AT", 1000);

  // SET GPRS
  sendCommand("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"", 2000);

  // SET APN (CHANGE IF NEEDED)
  sendCommand("AT+SAPBR=3,1,\"APN\",\"airtelgprs.com\"", 2000);

  sendCommand("AT+SAPBR=1,1", 3000);

  sendCommand("AT+HTTPINIT", 2000);

  // 🔥 IMPORTANT: PUT YOUR NGROK URL HERE
  sendCommand("AT+HTTPPARA=\"URL\",\"http://<your-ngrok-link>/location\"", 2000);

  sendCommand("AT+HTTPPARA=\"CONTENT\",\"application/x-www-form-urlencoded\"", 2000);

  sendCommand("AT+HTTPDATA=100,10000", 2000);

  gsm.print(data);
  delay(3000);

  sendCommand("AT+HTTPACTION=1", 6000);

  sendCommand("AT+HTTPTERM", 2000);
}

void sendCommand(String cmd, int delayTime) {
  gsm.println(cmd);
  Serial.println("Sending: " + cmd);

  delay(delayTime);

  while (gsm.available()) {
    Serial.write(gsm.read());
  }
}