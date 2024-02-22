#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>

#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

/****************** BME280 ********************/
Adafruit_BME280 bme; // I2C
unsigned long delayTime;
/****************** BME280 ********************/

/****************** RPM Sensor ********************/
volatile unsigned long previousMillis = 0;
volatile unsigned long pulseDuration = 0;
float pulsePeriodMs = 0;
float pulseRPM = 0;
volatile boolean fallingEdgeDetected = false;
const int interruptPin = 2;
/****************** RPM Sensor ********************/


void printValues()
{
  Serial.print("temp:");
  Serial.print(bme.readTemperature());
  Serial.print("*C, ");

  Serial.print("pressure:");
  Serial.print(bme.readPressure() / 100.0F);
  Serial.print("hPa, ");

  Serial.print("humidity:");
  Serial.print(bme.readHumidity());
  Serial.print("%");

  Serial.print(", PDuration:");
  Serial.print(pulseDuration);

  Serial.print(", PPeriod:");
  Serial.print(pulsePeriodMs);

  Serial.print(", rpm:");
  Serial.println(pulseRPM);
}

void fallInterrupt() {
  unsigned long currentMillis = micros(); // Use micros() for microsecond precision
  if (previousMillis != 0) {
    pulseDuration = currentMillis - previousMillis;
    fallingEdgeDetected = true;
  }
  previousMillis = currentMillis;
  pulsePeriodMs = pulseDuration / 1000.0; // Convert microseconds to milliseconds
  pulseRPM = (1.0 /((pulsePeriodMs / 1000.0) * 8.0)) * 60.0; // 8div; convert to seconds, freq then per minutes
}



void setup()
{
  Serial.begin(115200);

  /****************** BME280 ********************/
  bool result;
  result = bme.begin();
  if (!result)
  {
    Serial.println("Init Fail,Please Check your address or the wire you connected!!!");
    while (1)
      ;
  }
  Serial.println("BME Init Success");
  delayTime = 40;
  /****************** BME280 ********************/

  /****************** RPM Sensor ********************/
  pinMode(interruptPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(interruptPin), fallInterrupt, FALLING);
  /****************** RPM Sensor ********************/

}

void loop()
{
  printValues();
  delay(delayTime);
}
