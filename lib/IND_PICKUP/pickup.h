#ifndef pickup_h
#define pickup_h

// setup IND pickup sensor
void initializeInductivePickup();

// Update period, frequency and RPM variables in the interrupt
void fallInterruptB();

// return engine RPM
float getInductivePickupRPM();

#endif