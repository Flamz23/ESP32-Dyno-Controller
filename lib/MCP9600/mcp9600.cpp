#include <Wire.h>
#include <Adafruit_I2CDevice.h>
#include <Adafruit_I2CRegister.h>
#include "Adafruit_MCP9600.h"
#include "../config.h"
#include "mcp9600.h"

#define I2C_ADDRESS (0x67)

Adafruit_MCP9600 mcp;

void initializeMCP9600() {
    if (!mcp.begin(I2C_ADDRESS)) {
        Serial.println("Could not find valid MCP9600 sensor, check wiring!");
        while (1);
    }
    Serial.println("MCP9600 Initialized Success");

    mcp.setADCresolution(MCP9600_ADCRESOLUTION_18);
    Serial.print("ADC resolution set to 18 bits");

    mcp.setThermocoupleType(MCP9600_TYPE_K);
    Serial.print("Thermocouple type set to K type");

    mcp.setFilterCoefficient(MCP9600_FILTER_COEFFICIENT);
    Serial.print("Filter coefficient set to: ");
    Serial.println(mcp.getFilterCoefficient());

    mcp.enable(true);
}

float getMCP9600Temperature() {
    return mcp.readThermocouple(); // Celsius
}

float getMCP9600AmbientTemperature() {
    return mcp.readAmbient(); // Celsius
}

