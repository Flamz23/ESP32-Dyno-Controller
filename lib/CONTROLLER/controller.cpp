#include <Arduino.h>
#include "../config.h"
#include "controller.h"

void readSerial(void) {
    // Check if there is data available to read
    if (Serial.available() > 0) {
        // Read the incoming byte
        char incomingByte = Serial.read();

        // Print the value to the serial monitor
        Serial.print("I received: ");
        Serial.println(incomingByte, DEC);
    }
}

void writeSerial(void) {
    // Print a message to the serial monitor
    Serial.println("Hello, World!");
}