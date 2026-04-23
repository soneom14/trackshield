#include <SoftwareSerial.h>

SoftwareSerial gsm(2, 3); // RX, TX

String bandID = "TS-1001";
String phoneNumber = "+91XXXXXXXXXX";

int sosButton = 4;

void setup() {
  Serial.begin(9600);
  gsm.begin(9600);

  pinMode(sosButton, INPUT_PULLUP);

  delay(3000);

  Serial.println("TrackShield Started...");
  initGSM();
}

void loop() {
  if (digitalRead(sosButton) == LOW) {
    sendSMS();
    delay(10000); // debounce + avoid spam
  }
}

// 🔹 Initialize GSM
void initGSM() {
  gsm.println("AT");
  delay(1000);

  gsm.println("AT+CMGF=1"); // SMS text mode
  delay(1000);

  Serial.println("GSM Ready");
}

// 🔹 Send SMS
void sendSMS() {
  String message = "🚨 TRACKSHIELD ALERT 🚨\n";
  message += "Band ID: " + bandID + "\n";
  message += "Location:\n";
  message += "https://maps.google.com/?q=18.5204,73.8567";

  gsm.println("AT+CMGS=\"" + phoneNumber + "\"");
  delay(1000);

  gsm.print(message);
  delay(1000);

  gsm.write(26); // CTRL+Z
  delay(5000);

  Serial.println("SMS Sent");
}