#include <Arduino.h>
#include "bme280.h"
#include "stingray.h"
#include "rpmsensor.h"
#include "pickup.h"
#include "../lib/config.h"

// Print values to serial monitor
void printValues() {

  Serial.print("<");
  Serial.print(getBME280Temperature());

  Serial.print(",");
  Serial.print(getBME280Humidity());

  Serial.print(",");
  Serial.print(getBME280Pressure());

  Serial.print(",");
  Serial.print(getFlywheelRPM());

  Serial.print(",");
  Serial.print(getInductivePickupRPM());
}

int pos = 0;
int direction = 1;

void sweepServo() {
  setServoAngle(pos);
  if (pos <= 0 || pos >= 180) {
    direction = -direction;
  }
  pos += direction;
}

void setup() {
  Serial.begin(115200);
  while (!Serial) {
      delay(10);
    }
    Serial.println("Serial test");

  initializeBME280();
  initializeServo();
  initializeRPMSensor();
  initializeInductivePickup();
}

void loop() {
  printValues();
  sweepServo();
  delay(20);
}
