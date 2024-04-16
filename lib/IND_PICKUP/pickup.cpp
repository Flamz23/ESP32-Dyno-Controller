#include <Arduino.h>
#include "../config.h"
#include "pickup.h"

float pulsePeriodS = 0;
float pulseFrequencyHzB = 0;
volatile unsigned long previousMicrosB = 0;
volatile unsigned long elapsedTimeB = 0;

// Interrupt service routine
void fallInterruptB() {
  // Get current time in microseconds
  unsigned long currentMicros = micros();

  // If previousMillis is not 0, calculate elapsed time
  if (previousMicrosB != 0)
  {
      elapsedTimeB = currentMicros - previousMicrosB;
  }
  previousMicrosB = currentMicros;

  // Convert microseconds to seconds
  pulsePeriodS = elapsedTimeB * 0.000001;

  // Calculate frequency in Hz (1/period in seconds)
  pulseFrequencyHzB = 1.0 / pulsePeriodS;
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
  float pulseRPM = (pulseFrequencyHzB / 4) * 60.0;

  // Return RPM
  return pulseRPM;
}


