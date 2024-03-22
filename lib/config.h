#ifndef config_h
#define config_h

// Pin assignments
#define PIN_RPM_SENSOR 4
#define PIN_IND_PICKUP_SENSOR 5
#define PIN_SERVO_PWM 7

// RPM sensor
#define TRIGGER_WHEEL_DIV 8.0

// STINGRAY_SERVO
#define SERVO_PULSE_FREQ_HZ 50
#define SERVO_PW_MAX 2000
#define SERVO_PW_MIN 1000

// MCP9600
#define MCP9600_I2C_ADDRESS 0x67
#define MCP9600_FILTER_COEFFICIENT 3 // number of readings to average (0-7)

#endif