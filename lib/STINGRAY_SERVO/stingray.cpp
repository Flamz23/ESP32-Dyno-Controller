#include <ESP32Servo.h>
#include <Arduino.h>
#include "../config.h"
#include "stingray.h"

Servo servo;

void initializeServo() {
    // Allow allocation of all timers
	ESP32PWM::allocateTimer(0);
	ESP32PWM::allocateTimer(1);
	ESP32PWM::allocateTimer(2);
	ESP32PWM::allocateTimer(3);

    pinMode(PIN_SERVO_PWM, OUTPUT);
    
    // Pulse width frequency
	servo.setPeriodHertz(SERVO_PULSE_FREQ_HZ);

    // Pulse width range
    servo.attach(PIN_SERVO_PWM, SERVO_PW_MIN, SERVO_PW_MAX);
}

void setServoAngle(int angle) {
    servo.write(angle);
}