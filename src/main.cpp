#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>

#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

Adafruit_BME280 bme; // I2C

unsigned long delayTime;


void printValues() {
    Serial.print("temp:");
    Serial.print(bme.readTemperature());
    Serial.print("*C, ");

    Serial.print("pressure:");
    Serial.print(bme.readPressure()/100.0F);
    Serial.print("hPa, ");

    Serial.print("humidity:");
    Serial.print(bme.readHumidity());
    Serial.println("%");
}

void setup() {
  Serial.begin(115200);

  bool rslt;
    rslt = bme.begin();  
    if (!rslt) {
        Serial.println("Init Fail,Please Check your address or the wire you connected!!!");
        while (1);
    }

    Serial.println("Init Success");
    Serial.println("Temperature           Pressure             Humidity");
    delayTime = 40;
}

void loop() {
  printValues();
  delay(delayTime);
}

