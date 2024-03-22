#ifndef rpm_sensor_h
#define rpm_sensor_h

// setup RPM sensor
void initializeRPMSensor();

// Update period, frequency and RPM variables in the interrupt
void fallInterrupt();

// return flywheel RPM
float getFlywheelRPM();

#endif