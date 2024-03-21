#include <Arduino.h>


/****************** RPM Sensor ********************/
float pulsePeriodMs = 0;
float pulseRPM = 0;
volatile unsigned long previousMillis = 0;
volatile unsigned long pulseDuration = 0;
volatile boolean fallingEdgeDetected = false;
/****************** RPM Sensor ********************/

// Print values to serial monitor
void printValues() {
  Serial.print("temp:");
  Serial.print(bme.readTemperature()); // *C
  Serial.print("pressure:");
  Serial.print(bme.readPressure() / 100.0F); // hPa

  Serial.print("humidity:");
  Serial.print(bme.readHumidity()); // %

  Serial.print(", PDuration:");
  Serial.print(pulseDuration);

  Serial.print(", PPeriod:");
  Serial.print(pulsePeriodMs);

  Serial.print(", rpm:");
  Serial.println(pulseRPM);
}

// Update period and RPM variables
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
  delayTime = 20;
  /****************** BME280 ********************/

  /****************** RPM Sensor ********************/
  pinMode(RPM_SENSOR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(RPM_SENSOR_PIN), fallInterrupt, FALLING);
  /****************** RPM Sensor ********************/
}

void loop()
{
  printValues();
  delay(delayTime);
}
