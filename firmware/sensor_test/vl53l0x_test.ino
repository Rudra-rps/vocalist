#include <Wire.h>
#include <Adafruit_VL53L0X.h>

Adafruit_VL53L0X lox = Adafruit_VL53L0X();

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    delay(10);
  }

  Serial.println("VL53L0X distance test booting...");
  Wire.begin();

  if (!lox.begin()) {
    Serial.println("VL53L0X not detected. Check wiring and power.");
    while (true) {
      delay(1000);
    }
  }

  Serial.println("VL53L0X ready.");
}

void loop() {
  VL53L0X_RangingMeasurementData_t measure;
  lox.rangingTest(&measure, false);

  if (measure.RangeStatus != 4) {
    Serial.print("Distance (mm): ");
    Serial.println(measure.RangeMilliMeter);
  } else {
    Serial.println("Distance out of range");
  }

  delay(200);
}

