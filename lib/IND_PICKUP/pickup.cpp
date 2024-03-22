#include <Arduino.h>
#include "../config.h"
#include "pickup.h"

float pulsePeriodS = 0;
float pulseFrequencyHz = 0;
volatile unsigned long previousMicros = 0;
volatile unsigned long elapsedTime = 0;

// Interrupt service routine
void fallInterruptB() {
  // Get current time in microseconds
  unsigned long currentMicros = micros();

  // If previousMillis is not 0, calculate elapsed time
  if (previousMicros != 0)
  {
      elapsedTime = currentMicros - previousMicros;
  }
  previousMicros = currentMicros;

  // Convert microseconds to seconds
  pulsePeriodS = (elapsedTime / 1000.0) / 1000.0;

  // Calculate frequency in Hz (1/period in seconds)
  pulseFrequencyHz = 1.0 / pulsePeriodS;
}

void initializeInductivePickup()
{
  // Set RPM sensor pin as input with pull-up resistor
  pinMode(PIN_IND_PICKUP_SENSOR, INPUT_PULLUP);

  // Attach interrupt to RPM sensor pin
  attachInterrupt(digitalPinToInterrupt(PIN_IND_PICKUP_SENSOR), fallInterruptB, FALLING);
}

float getInductivePickupRPM()
{
  // Calculate RPM from frequency
  float pulseRPM = pulseFrequencyHz * 60.0;

  // Return RPM
  return pulseRPM;
}


