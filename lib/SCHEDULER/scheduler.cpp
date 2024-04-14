#include <Arduino.h>
#include "../config.h"
#include "scheduler.h"

#include "pickup.h"

#define STATE_INIT 0
#define STATE_IDLE 1
#define STATE_THROTTLE 2
#define STATE_DWELL 3
#define STATE_BRAKE 4

void Scheduler(void) {
    static int nextState = STATE_INIT;
    static bool configReceived = false;
    static bool engineStarted = false;

    switch (nextState) {
    case STATE_INIT:
        char configCommand = '<';
        char startCommand = '$';
        char config[26];

        // Check if config has been received
        if (!configReceived) {
            // Check if there is data available to read
            if (Serial.available() > 0) {
                // Read the incoming byte
                char incomingByte = Serial.read();
                
                // Check if the byte is valid
                if (incomingByte == configCommand) {
                    for (int i = 0; i < 26; i++) {
                        config[i] = Serial.read(); 
                    }
                    configReceived = true;
                }

                // #TODO: print config to serial monitor
                // Print the value to the serial monitor
                // Serial.print("I received: ");
            }
        }
        
        // Check if the start command has been received
        if (Serial.available() > 0) {
            // Read the incoming byte
            char incomingByte = Serial.read();
            
            // Check if the incoming byte is valid
            if (incomingByte == startCommand) {
                nextState = STATE_IDLE;
                Serial.println("Engine started");
            }
        }
        break;
    case STATE_IDLE:
        // PID parameters
        double Kp = 1.0; // Proportional gain
        double Ki = 0.0; // Integral gain
        double Kd = 0.0; // Derivative gain

        int setpoint = 1500; // Desired setpoint
        

        // #TODO: check if rpm is 0 when inductive pickup is not connected

        // Check if the engine has been started
        if (getInductivePickupRPM() > 0) {
            engineStarted = true;
        } else {
            engineStarted = false;
            Serial.println("Engine not started");
        }

        


        break;
    case STATE_THROTTLE:
        /* code */
        break;
    case STATE_DWELL:
        /* code */
        break;
    case STATE_BRAKE:
        /* code */
        break;
    }
}

void stateInit(void) {
    
}

void stateIdle(void) {
    
}

void stateThrottle(void) {
    
}

void stateDwell(void) {
    
}

void stateBrake(void) {
    
}