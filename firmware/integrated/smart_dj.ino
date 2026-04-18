#include <Wire.h>
#include <Adafruit_VL53L0X.h>
#include <driver/i2s.h>

Adafruit_VL53L0X lox = Adafruit_VL53L0X();

// Keep demo mode on by default while hardware is unstable.
// Set this to false later when you want the sketch to try live sensors first.
static const bool FORCE_DEMO_MODE = true;
static const unsigned long LOOP_DELAY_MS = 200;

static const int I2S_WS = 25;
static const int I2S_SCK = 26;
static const int I2S_SD = 33;
static const i2s_port_t I2S_PORT = I2S_NUM_0;
static const int SAMPLE_BUFFER_SIZE = 256;
static const int SOUND_GOOD_THRESHOLD = 1000;
static const int SOUND_HYPE_THRESHOLD = 2000;
static const int SOUND_TOO_LOUD_THRESHOLD = 3200;

int32_t samples[SAMPLE_BUFFER_SIZE];
bool liveMode = false;
int currentScenario = 2;
unsigned long tickCount = 0;
float smoothedSound = 0.0f;

const char* scenarioKeys[] = {
  "warmup_room",
  "crowd_surge",
  "peak_hour",
  "too_loud_alert",
  "late_night_dip"
};

struct DemoSample {
  int distanceMm;
  int soundLevel;
};

void setupI2S() {
  const i2s_config_t config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = 16000,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = 0,
    .dma_buf_count = 8,
    .dma_buf_len = 64,
    .use_apll = false,
    .tx_desc_auto_clear = false,
    .fixed_mclk = 0
  };

  const i2s_pin_config_t pins = {
    .bck_io_num = I2S_SCK,
    .ws_io_num = I2S_WS,
    .data_out_num = I2S_PIN_NO_CHANGE,
    .data_in_num = I2S_SD
  };

  i2s_driver_install(I2S_PORT, &config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pins);
  i2s_zero_dma_buffer(I2S_PORT);
}

int clampValue(int value, int lower, int upper) {
  if (value < lower) {
    return lower;
  }
  if (value > upper) {
    return upper;
  }
  return value;
}

int mapDensity(int distanceMm) {
  long density = map(clampValue(distanceMm, 50, 2000), 50, 2000, 100, 0);
  return clampValue((int)density, 0, 100);
}

int readSoundLevel() {
  size_t bytesRead = 0;
  i2s_read(I2S_PORT, samples, sizeof(samples), &bytesRead, portMAX_DELAY);
  int count = bytesRead / sizeof(int32_t);

  if (count == 0) {
    return 0;
  }

  int64_t accumulator = 0;
  for (int i = 0; i < count; i++) {
    int32_t centered = samples[i] >> 14;
    accumulator += abs(centered);
  }

  return accumulator / count;
}

int smoothSound(int rawSound) {
  smoothedSound = 0.25f * rawSound + 0.75f * smoothedSound;
  return (int)smoothedSound;
}

const char* classifyState(int density, int soundLevel) {
  if (soundLevel >= SOUND_TOO_LOUD_THRESHOLD) {
    return "TOO LOUD";
  }
  if (density >= 70 && soundLevel >= SOUND_HYPE_THRESHOLD) {
    return "HYPE";
  }
  if (soundLevel >= SOUND_GOOD_THRESHOLD || density >= 55) {
    return "GOOD";
  }
  return "LOW";
}

DemoSample generateDemoSample(unsigned long tick, int scenario) {
  DemoSample sample;
  switch (scenario) {
    case 0:
      sample.distanceMm = 1350 + 180 * sin(tick / 4.5f) - ((tick % 7 == 0) ? 90 : 0);
      sample.soundLevel = 650 + 240 * sin((tick / 3.2f) + 0.7f) + ((tick % 5 == 0) ? 200 : 0);
      break;
    case 1:
      sample.distanceMm = 720 + 320 * sin(tick / 4.6f) - ((tick % 7 == 0) ? 220 : 0);
      sample.soundLevel = 1200 + 500 * sin((tick / 3.4f) + 0.7f) + ((tick % 5 == 0) ? 380 : 0);
      break;
    case 2:
      sample.distanceMm = 380 + 150 * sin(tick / 4.6f) - ((tick % 7 == 0) ? 120 : 0);
      sample.soundLevel = 2200 + 760 * sin((tick / 3.4f) + 0.7f) + ((tick % 5 == 0) ? 650 : 0);
      break;
    case 3:
      sample.distanceMm = 300 + 80 * sin(tick / 4.2f) - ((tick % 7 == 0) ? 60 : 0);
      sample.soundLevel = 2900 + 820 * sin((tick / 3.0f) + 0.4f) + ((tick % 5 == 0) ? 900 : 0);
      break;
    default:
      sample.distanceMm = 1500 + 280 * sin(tick / 4.4f) - ((tick % 7 == 0) ? 70 : 0);
      sample.soundLevel = 540 + 180 * sin((tick / 3.6f) + 0.7f) + ((tick % 5 == 0) ? 130 : 0);
      break;
  }

  sample.distanceMm = clampValue(sample.distanceMm, 80, 2000);
  sample.soundLevel = clampValue(sample.soundLevel, 120, 4096);
  return sample;
}

bool initLiveHardware() {
  Wire.begin();
  setupI2S();

  if (!lox.begin()) {
    Serial.println("VL53L0X init failed. Falling back to demo mode.");
    return false;
  }

  return true;
}

void emitFrame(int distanceMm, int soundLevel, const char* mode, const char* scenario) {
  int density = mapDensity(distanceMm);
  int stableSound = smoothSound(soundLevel);
  const char* state = classifyState(density, stableSound);

  Serial.print("distance=");
  Serial.print(distanceMm);
  Serial.print(",sound=");
  Serial.print(stableSound);
  Serial.print(",density=");
  Serial.print(density);
  Serial.print(",state=");
  Serial.print(state);
  Serial.print(",mode=");
  Serial.print(mode);
  Serial.print(",scenario=");
  Serial.print(scenario);
  Serial.print(",tick=");
  Serial.println(tickCount);
}

void handleCommand(String command) {
  command.trim();
  command.toLowerCase();

  if (command == "status") {
    Serial.print("Current mode: ");
    Serial.println(liveMode ? "LIVE" : "DEMO");
    Serial.print("Scenario: ");
    Serial.println(scenarioKeys[currentScenario]);
    return;
  }

  if (command == "demo") {
    liveMode = false;
    Serial.println("Switched to demo mode.");
    return;
  }

  if (command == "live") {
    liveMode = initLiveHardware();
    Serial.println(liveMode ? "Switched to live mode." : "Live mode unavailable, still in demo mode.");
    return;
  }

  if (command == "next") {
    currentScenario = (currentScenario + 1) % 5;
    Serial.print("Scenario: ");
    Serial.println(scenarioKeys[currentScenario]);
    return;
  }

  if (command.startsWith("scenario ")) {
    int requested = command.substring(9).toInt() - 1;
    if (requested >= 0 && requested < 5) {
      currentScenario = requested;
      Serial.print("Scenario: ");
      Serial.println(scenarioKeys[currentScenario]);
    } else {
      Serial.println("Scenario index must be between 1 and 5.");
    }
  }
}

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    delay(10);
  }

  Serial.println("Smart DJ Booth booting...");
  liveMode = !FORCE_DEMO_MODE && initLiveHardware();

  if (liveMode) {
    Serial.println("Running in live hardware mode.");
  } else {
    Serial.println("Running in demo fallback mode.");
  }
}

void loop() {
  if (Serial.available()) {
    handleCommand(Serial.readStringUntil('\n'));
  }

  if (liveMode) {
    VL53L0X_RangingMeasurementData_t measure;
    lox.rangingTest(&measure, false);

    if (measure.RangeStatus == 4) {
      emitFrame(2000, readSoundLevel(), "LIVE", "live_sensor");
    } else {
      emitFrame(measure.RangeMilliMeter, readSoundLevel(), "LIVE", "live_sensor");
    }
  } else {
    DemoSample sample = generateDemoSample(tickCount, currentScenario);
    emitFrame(sample.distanceMm, sample.soundLevel, "DEMO", scenarioKeys[currentScenario]);
  }

  tickCount++;
  delay(LOOP_DELAY_MS);
}
