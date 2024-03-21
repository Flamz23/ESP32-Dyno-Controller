#ifndef bme280_h
#define bme280_h

// setup BME280
void initializeBME280();

// get temperature from BME280
float getBME280Temperature();

// get pressure from BME280
float getBME280Pressure();

// get humidity from BME280
float getBME280Humidity();

#endif