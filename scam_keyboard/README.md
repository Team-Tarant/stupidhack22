# scam_keyboard

Firmware for the ESP32 () devboard which acts as a USB keyboard to actually write the user input as a keyboard.

## Installing

1. Install Arduino IDE
2. Install the esp32 board (https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html)
3. Open Arduino IDE
4. Open the .ino file with the IDE
5. Select our board: Tools -> Board -> ESP32 Arduino -> LOLIN S2 mini
6. Look at Tools -> Port, make note of which ones are here
7. Connect the S2 mini with USB
8. Wait a few seconds, look at Tools -> Port and pick the new one in the list (e.g. /dev/cu.usbmodem01 or something)

## Programming the firmware

1. Do the steps in Installing
2. On the S2 mini, hold the button labeled as "0" and while holding it, press on the RST button (reset)
    - this puts it into bootloader mode so it can be programmed
3. Release the buttons
4. Click on the arduino ide upload button
5. Wait for upload
6. It will say something like "WARNING: ESP32-S2FNR2 chip was placed into download mode using GPIO0. esptool.py can not exit the download mode over USB. To run the app, reset the chip manually."
7. Ignore that error, it worked
8. While **NOT** holding the "0" button, press the RST button once
9. It's now running your code
