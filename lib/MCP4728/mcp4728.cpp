#include <Adafruit_MCP4728.h>
#include <Wire.h>
#include "../config.h"
#include "mcp4728.h"

Adafruit_MCP4728 mcp;

void initializeMCP4728(void) {
    if (!mcp.begin()) {
        Serial.println("Could not find valid MCP4728 sensor, check wiring!");
        while (1);
    }
    Serial.println("MCP4728 Initialized Success");
}

void setMCP4728(int channel, uint16_t value) {
    switch (channel) {
    case 1:
        mcp.setChannelValue(MCP4728_CHANNEL_A, value);
        break;
    case 2:
        mcp.setChannelValue(MCP4728_CHANNEL_B, value);
        break;
    case 3:
        mcp.setChannelValue(MCP4728_CHANNEL_C, value);
        break;
    case 4:
        mcp.setChannelValue(MCP4728_CHANNEL_D, value);
        break;
    default:
        mcp.setChannelValue(MCP4728_CHANNEL_A, value);
        break;
    }
}
