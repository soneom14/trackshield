#include <SoftwareSerial.h>
#include <AltSoftSerial.h>
#include <TinyGPS++.h>

//--------------------------------------------------------------
// Enter your phone number with country code
const String PHONE = "+91XXXXXXXXXX";   // <-- CHANGE THIS
//--------------------------------------------------------------

// GSM Module (SIM800L)
#define rxPin 2
#define txPin 3
SoftwareSerial sim800(rxPin, txPin);

// GPS Module (NEO-6M)
AltSoftSerial neogps;
TinyGPSPlus gps;

// Buzzer
#define BUZZER 4

//--------------------------------------------------------------
// Alarm variables
int buzzer_timer = 0;
bool alarm = false;
boolean send_alert_once = true;

// Geo-fence (30 meters)
const float maxDistance = 30;

// Initial position (auto-set)
float initialLatitude = 0;
float initialLongitude = 0;

float latitude, longitude;

//--------------------------------------------------------------
void getGps(float& latitude, float& longitude);

//--------------------------------------------------------------
// SETUP
void setup()
{
  Serial.begin(9600);
  sim800.begin(9600);
  neogps.begin(9600);

  pinMode(BUZZER, OUTPUT);

  // GSM setup
  sim800.println("AT");
  delay(1000);
  sim800.println("ATE1");
  delay(1000);
  sim800.println("AT+CPIN?");
  delay(1000);
  sim800.println("AT+CMGF=1");
  delay(1000);
  sim800.println("AT+CNMI=1,1,0,0,0");
  delay(1000);

  delay(20000); // wait for GPS signal

  // ✅ Set initial position automatically
  Serial.println("Setting initial position...");
  getGps(initialLatitude, initialLongitude);

  Serial.print("Initial Latitude: ");
  Serial.println(initialLatitude, 6);
  Serial.print("Initial Longitude: ");
  Serial.println(initialLongitude, 6);

  buzzer_timer = millis();
}

//--------------------------------------------------------------
// LOOP
void loop()
{
  getGps(latitude, longitude);

  float distance = getDistance(latitude, longitude, initialLatitude, initialLongitude);

  Serial.print("Current Lat: "); Serial.println(latitude, 6);
  Serial.print("Current Lon: "); Serial.println(longitude, 6);
  Serial.print("Distance: "); Serial.println(distance);

  // Check geo-fence
  if (distance > maxDistance) {
    if (send_alert_once == true) {
      digitalWrite(BUZZER, HIGH);
      sendAlert();
      alarm = true;
      send_alert_once = false;
      buzzer_timer = millis();
    }
  }
  else {
    send_alert_once = true;
  }

  // Turn off buzzer after 5 seconds
  if (alarm == true) {
    if (millis() - buzzer_timer > 5000) {
      digitalWrite(BUZZER, LOW);
      alarm = false;
    }
  }

  // GSM debugging
  while (sim800.available()) {
    Serial.println(sim800.readString());
  }
}

//--------------------------------------------------------------
// DISTANCE CALCULATION
float getDistance(float flat1, float flon1, float flat2, float flon2)
{
  float diflat = radians(flat2 - flat1);
  flat1 = radians(flat1);
  flat2 = radians(flat2);
  float diflon = radians(flon2 - flon1);

  float dist = sin(diflat / 2) * sin(diflat / 2) +
               cos(flat1) * cos(flat2) *
               sin(diflon / 2) * sin(diflon / 2);

  dist = 2 * atan2(sqrt(dist), sqrt(1 - dist));
  dist = dist * 6371000; // meters

  return dist;
}

//--------------------------------------------------------------
// GPS FUNCTION
void getGps(float& latitude, float& longitude)
{
  boolean newData = false;

  for (unsigned long start = millis(); millis() - start < 2000;) {
    while (neogps.available()) {
      if (gps.encode(neogps.read())) {
        newData = true;
        break;
      }
    }
  }

  if (newData) {
    latitude = gps.location.lat();
    longitude = gps.location.lng();
  }
  else {
    Serial.println("No GPS data");
    latitude = 0;
    longitude = 0;
  }
}

//--------------------------------------------------------------
// SEND SMS ALERT
void sendAlert()
{
  String sms_data;
  sms_data = "Alert! Child moving out of fence.\r";
  sms_data += "Location: ";
  sms_data += "http://maps.google.com/maps?q=loc:";
  sms_data += String(latitude, 6) + "," + String(longitude, 6);

  sim800.print("AT+CMGF=1\r");
  delay(1000);
  sim800.print("AT+CMGS=\"" + PHONE + "\"\r");
  delay(1000);
  sim800.print(sms_data);
  delay(100);
  sim800.write(0x1A);
  delay(1000);

  Serial.println("SMS Sent!");
}