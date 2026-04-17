#!/usr/bin/python3
from __future__ import print_function
import paho.mqtt.client as mqtt # pip install paho-mqtt
import ssl
import json

# mqtt configuration
server = "localhost"
port = 1883
#username = ""
#password = ""
topics = {'mioty/+/+/uplink', 'mioty/+/+/uplinkDuplicate'}


def on_message(client, userdata, message):
    print("Message published:", message.topic)
    #print("  ", message.payload)
    fields = json.loads(message.payload.decode("utf-8"))
    print("   Receiving base stations:")
    for i in fields['baseStations']:
        print("      bsEui:", hex(i["bsEui"]), ",rssi:", round(i["rssi"], 1), "dBm, snr:", round(i["snr"], 1), "dB")

    if(fields['typeEui'] != 0):
        print("   End point type:")
        print("      typeEui:", hex(fields['typeEui']))
    if(isinstance(fields['meta'], dict)):
        for x in  fields['meta']:
            print("      ", x, ": ", fields['meta'][x], sep = "")

    print("   End point data:")
    print("      raw:", fields['data'])
    valueDict = fields['components']
    if(isinstance(valueDict, dict)):
        for x in valueDict:
            print("      ", x, ": ", valueDict[x]["value"], " ", valueDict[x]["unit"], sep = "")

    print("\n\n")


def on_connect(client,userdata,flag,rc):
    print("connect")
    for t in topics:
        client.subscribe(t)


client = mqtt.Client()
#client.username_pw_set(username, password)
#client.tls_set(cert_reqs=ssl.CERT_NONE, tls_version=ssl.PROTOCOL_TLSv1_2)

client.on_message = on_message
client.on_connect = on_connect
client.connect(server, port, 60)

try:
    client.loop_forever()

except KeyboardInterrupt:
    client.loop_stop()
    client.disconnect()
