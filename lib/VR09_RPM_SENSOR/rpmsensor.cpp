#include <Arduino.h>
#include "../config.h"
#include "rpmsensor.h"

float pulsePeriodMs = 0;
float fullPeriod = 0;
float pulseFrequencyHz = 0;
volatile unsigned long previousMicros = 0;
volatile unsigned long elapsedTime = 0;

// Interrupt service routine
void fallInterrupt() {
  // Get current time in microseconds
  unsigned long currentMicros = micros();

  // If previousMillis is not 0, calculate elapsed time
  if (previousMicros != 0)
  {
      elapsedTime = currentMicros - previousMicros;
  }
  previousMicros = currentMicros;

  // Convert microseconds to milliseconds
  pulsePeriodMs = elapsedTime / 1000.0;

  // Calculate period for full rotation in seconds
  fullPeriod= (pulsePeriodMs / 1000.0) * TRIGGER_WHEEL_DIV;

  // Calculate frequency in Hz (1/period in seconds)
  pulseFrequencyHz = 1.0 / fullPeriod;
}

void initializeRPMSensor()
{
  // Set RPM sensor pin as input with pull-up resistor
  pinMode(PIN_RPM_SENSOR, INPUT_PULLUP);

  // Attach interrupt to RPM sensor pin
  attachInterrupt(digitalPinToInterrupt(PIN_RPM_SENSOR), fallInterrupt, FALLING);
}

float getFlywheelRPM()
{
  // Calculate RPM from frequency
  float pulseRPM = pulseFrequencyHz * 60.0;

  // Return RPM
  return pulseRPM;
}