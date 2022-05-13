#if ARDUINO_USB_MODE
#warning This sketch should be used when USB is in OTG mode
#endif

#include <USB.h>
#include <USBHIDKeyboard.h>
#define ARDUINOJSON_DECODE_UNICODE 0
#include <ArduinoJson.h>

// max length of serial message from raspi before \r\n
#define SERIAL_BUFFER_SIZE 8192
// max bytes for json document in-memory structures, see https://arduinojson.org/v6/doc/deserialization/
// we have a shitload of memory so just give it all to JSON lol
constexpr size_t JSON_CAPACITY = SERIAL_BUFFER_SIZE * 10;

const uint32_t RASPI_RX1 = 37;
const uint32_t RASPI_TX1 = 39;

void writeToBuffer(uint8_t c);
bool bufferIsTerminatedWithCrLf();
void resetBuffer();
// void dumpBufferStringToKeyboard();
void executeWebAction(JsonObject webaction);
void parseCmdAndExecute();

USBHIDKeyboard Keyboard;

StaticJsonDocument<JSON_CAPACITY> commandJson;

uint8_t buffer[SERIAL_BUFFER_SIZE] = {0};
size_t bufferPtr = 0;

void setup() {
  // jumper serial
  Serial1.begin(115200, SERIAL_8N1, RASPI_RX1, RASPI_TX1);
  Serial1.setDebugOutput(true);
  // init keyboard before USB
  Keyboard.begin();
  USB.begin();
}

void loop() {
  while (Serial1.available() > 0) {
    uint8_t c = Serial1.read();
    writeToBuffer(c);

    if (bufferIsTerminatedWithCrLf()) {
      delay(3000);
      parseCmdAndExecute();
      resetBuffer();
    }
  }
}

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

void parseCmdAndExecute() {
  const char *buf = const_cast<const char *>(reinterpret_cast<char *>(&buffer[0]));
  // const char* and size => "read-only" input -> duplicates str into StaticJsonDocument
  DeserializationError err = deserializeJson(commandJson, buf, bufferPtr - 2);

  if (err != DeserializationError::Ok) {
    // ab fuck errors oy
    return;
  }

  JsonObject obj = commandJson.as<JsonObject>();

  const char *vittu = obj["dump_keymap"];
  if (vittu != nullptr && vittu[0] == 'y' && vittu[1] == 'e' && vittu[2] == 's') {
    for (uint8_t key = 32; key <= 126; key++) {
      Keyboard.write(key);
    }
    return;
  }
  
  const char *textToType = obj["typo"];
  if (textToType != nullptr) {
    Keyboard.print(textToType);
  }

  if (obj.containsKey("webaction")) {
    JsonVariant webaction = obj["webaction"];

    if (webaction.is<JsonObject>() && !webaction.isNull()) {
      executeWebAction(obj["webaction"]); 
    }
  }
}

uint8_t press(uint8_t key) {
  uint8_t res = Keyboard.press(key);
  delay(200);
  return res;
}

inline void kbdelay() {
  delay(200);
}

void typeDelayed(const char *str) {
  while (*str != '\0') {
    Keyboard.write(*str);
    delay(50);
    str++;
  }
}

void executeWebAction(JsonObject webaction) {
  const char *link = webaction["link"];
  if (link == nullptr) return;

  const char *cardNumber = webaction["cardNumber"];
  if (cardNumber == nullptr) return;

  // cmd+space
  Keyboard.press(KEY_LEFT_GUI);
  Keyboard.press(' ');
  kbdelay();
  Keyboard.releaseAll();
  kbdelay();

  delay(750);

  // open Chrome
  Keyboard.print("Terminal.app");
  kbdelay();
  Keyboard.write(KEY_RETURN);

  delay(1500);

  // Focus in URL bar
  /*Keyboard.press(KEY_LEFT_GUI);
  Keyboard.press('l');
  kbdelay();
  Keyboard.releaseAll();
  kbdelay();

  // Erase URL bar with "CMD+a", "backspace"
  Keyboard.press(KEY_LEFT_GUI);
  Keyboard.press('a');
  kbdelay();
  Keyboard.releaseAll();
  kbdelay();
  Keyboard.write(KEY_BACKSPACE);
  kbdelay();*/

  // Write our scam URL
  typeDelayed("open '");
  Keyboard.print(link);
  typeDelayed("'");
  Keyboard.write(KEY_RETURN);

  delay(500);

  // Kill terminal: alt tab into terminal
  Keyboard.press(KEY_LEFT_GUI);
  Keyboard.press(KEY_TAB);
  kbdelay();
  Keyboard.releaseAll();
  kbdelay();

  delay(700);

  // cmd+w to kill it
  Keyboard.press(KEY_LEFT_GUI);
  Keyboard.press('w');
  kbdelay();
  Keyboard.releaseAll();
  kbdelay();

  delay(400);

  // alt+tab back to chrome
  Keyboard.press(KEY_LEFT_GUI);
  Keyboard.press(KEY_TAB);
  kbdelay();
  Keyboard.releaseAll();
  kbdelay();

  delay(3000);

  Keyboard.write(KEY_TAB);
  kbdelay();
  typeDelayed(cardNumber);
  kbdelay();

  Keyboard.write(KEY_TAB);
  kbdelay();
  typeDelayed("0225");
  kbdelay();

  Keyboard.write(KEY_TAB);
  kbdelay();  
  typeDelayed("123");
  kbdelay();

  Keyboard.write(KEY_TAB);
  kbdelay();
  Keyboard.write(' ');
  kbdelay();
  Keyboard.print("fin");
  kbdelay();
  Keyboard.write(KEY_RETURN);
  kbdelay();

  Keyboard.write(KEY_TAB);
  kbdelay();
  //Keyboard.write(KEY_RETURN);
}

// {"typo": "k","webaction":{"link": "https://www.google.com", "cardNumber":"4242 4242 4242 4242"}}
