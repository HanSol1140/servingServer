# pip apt-get install python3-bluez
import bluetooth
from bluetooth.ble import DiscoveryService

def scan_bluetooth_devices():
    service = DiscoveryService()
    devices = service.discover(2) 
    # 스캔 시간을 2초로 설정
    for address, name in devices.items():
        print(f"Name: {name}, Address: {address}")

def parse_beacon_info(data):
    # iBeacon 프로토콜에 따라 비콘 정보 파싱
    # 이 부분은 실제 비콘의 프로토콜에 따라 달라질 수 있음
    uuid = data[9:25]
    major = data[25:27]
    minor = data[27:29]
    power = data[29]
    print(f"UUID: {uuid}, Major: {major}, Minor: {minor}, Power: {power}")

scan_bluetooth_devices()