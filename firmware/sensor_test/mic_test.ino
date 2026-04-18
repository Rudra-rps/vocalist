#include <driver/i2s.h>

static const i2s_port_t I2S_PORT = I2S_NUM_0;
static const int I2S_WS = 25;
static const int I2S_SCK = 26;
static const int I2S_SD = 33;
static const int SAMPLE_BUFFER_SIZE = 256;

int32_t samples[SAMPLE_BUFFER_SIZE];

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

int readLevel() {
  size_t bytesRead = 0;
  i2s_read(I2S_PORT, samples, sizeof(samples), &bytesRead, portMAX_DELAY);

  int count = bytesRead / sizeof(int32_t);
  int64_t accumulator = 0;
  for (int i = 0; i < count; i++) {
    int32_t centered = samples[i] >> 14;
    accumulator += abs(centered);
  }

  if (count == 0) {
    return 0;
  }

  return accumulator / count;
}

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    delay(10);
  }

  Serial.println("INMP441 mic test booting...");
  setupI2S();
  Serial.println("INMP441 ready.");
}

void loop() {
  int soundLevel = readLevel();
  Serial.print("Sound Level: ");
  Serial.println(soundLevel);
  delay(100);
}

