#include "bme280.h"
#include "../config.h"
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

Adafruit_BME280 bme; // I2C

void initializeBME280() {
    if(!bme.begin()) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!");
        while(1);
    }
    Serial.println("BME280 Initialized Success");
}

float getBME280Temperature() {
    return bme.readTemperature();
}

float getBME280Pressure() {
    return bme.readPressure() / 100.0F;
}

float getBME280Humidity() {
    return bme.readHumidity();
}