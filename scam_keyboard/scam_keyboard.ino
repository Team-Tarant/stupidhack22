#if ARDUINO_USB_MODE
#warning This sketch should be used when USB is in OTG mode
#endif

#include <USB.h>
#include <USBHIDKeyboard.h>

// max length of serial message from raspi before \r\n
#define SERIAL_BUFFER_SIZE 4096

const uint32_t RASPI_RX1 = 37;
const uint32_t RASPI_TX1 = 39;

USBHIDKeyboard Keyboard;

void setup() {
  // jumper serial
  Serial1.begin(115200, SERIAL_8N1, RASPI_RX1, RASPI_TX1);
  // init keyboard before USB
  Keyboard.begin();
  USB.begin();
}

uint8_t buffer[SERIAL_BUFFER_SIZE] = {0};
size_t bufferPtr = 0;

inline void writeToBuffer(uint8_t c) {
  if (bufferPtr >= SERIAL_BUFFER_SIZE) {
    // ignore if buffer overflow
    return;
  }

  buffer[bufferPtr++] = c;
}

inline bool bufferIsTerminatedWithCrLf() {
  if (bufferPtr < 2) {
    // has at least space for \r\n
    return false;
  }

  return buffer[bufferPtr - 1] == '\n' && buffer[bufferPtr - 2] == '\r';
}

inline void resetBuffer() {
  bufferPtr = 0;
}

void dumpBufferStringToKeyboard() {
  // -2 because skip \r\n
  for (size_t i = 0; i < bufferPtr - 2; i++) {
    Keyboard.write(buffer[i]);
    delay(100);
  }
}

void loop() {

  while (Serial1.available() > 0) {
    uint8_t c = Serial1.read();
    writeToBuffer(c);

    if (bufferIsTerminatedWithCrLf()) {
      delay(3000);
      dumpBufferStringToKeyboard();
      resetBuffer();
    }
  }
}
