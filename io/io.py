import keyboard
import serial
import sys
import requests

ser = serial.Serial(
        port='/dev/ttyS0', #Replace ttyS0 with ttyAM0 for Pi1,Pi2,Pi0
        baudrate = 115200,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
        bytesize=serial.EIGHTBITS,
        timeout=1
)

requestsS = requests.Session()
r = requestsS.get('https://tarant-transformation-engine.fly.dev/session')
session_id = r.json().get("sessionId")

shift = False
alt_gr = False

while True:
    k = keyboard.read_event()
    char = k.name

    if char == "esc":
        break

    if char.lower() == 'shift':
       if (k.event_type == "down"):
           shift = True
       else:
           shift = False
    
    if char == 'alt gr':
       if (k.event_type == "down"):
           alt_gr = True
       else:
           alt_gr = False

    else:
        if k.event_type == "down":
            if char.lower() == "space":
                char = " "
            elif char.lower() ==shift:
                char = char.upper()

            if alt_gr:
                if char == "2":
                    char = "@"
            
            if char == "backspace":
                sys.stdout.write("\b")
            elif char == "enter":
                print("")
            else:
                print(char, end="", flush=True)

            if len(char) > 1:
                ser.write(str.encode('{"key":"' + char + '"}\r\n'))
            elif char == " ":
                # dont blurse spacebar
                ser.write(str.encode('{"typo":" "}\r\n'))
            else:
                url = f"https://tarant-transformation-engine.fly.dev/typo?sessionId={session_id}&char={char}"
                r = requestsS.get(url)
                ser.write(str.encode(r.text + "\r\n"))
