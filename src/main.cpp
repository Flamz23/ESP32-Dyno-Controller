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
}

unsigned long previousMillis = 0;
int angle = 0;
int step = 1;
int SWEEP_INTERVAL = 15;

void sweepServo() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= SWEEP_INTERVAL) {
    previousMillis = currentMillis;
    angle += step;
    if (angle >= 180 || angle <= 0) {
      step = -step;
    }
    setServoAngle(angle);
  }
}

void setup() {
  Serial.begin(115200);

  initializeBME280();
  initializeServo();
  initializeRPMSensor();
}

void loop() {
  printValues();
  sweepServo();
  delay(20);
}
