#include <Servo.h>
#include <Arduino.h>
#include "../config.h"

Servo servo;

void initializeServo() {
    pinMode(PIN_SERVO_PWM, OUTPUT);
    servo.attach(PIN_SERVO_PWM);
}

void setServoAngle(int angle) {
    servo.write(angle);
}