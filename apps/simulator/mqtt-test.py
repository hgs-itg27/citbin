#!/usr/bin/python
# -*- coding: utf-8 -*- 
import paho.mqtt.client as mqtt 
import random
TOPIC = "home/tutorial/PubSubDemo" 
BROKER_ADDRESS = "localhost" 
PORT = 1883 
QOS = 1
client_id = f'python-mqtt-{random.randint(0, 1000)}'
if __name__ == "__main__": 


    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id)
    # client = mqtt.Client(client_id)
    # client = mqtt.Client() 
    client.connect(BROKER_ADDRESS, PORT) 
    print("Connected to MQTT Broker: " + BROKER_ADDRESS)   
    DATA = "{TEST_DATA}" 
    client.publish(TOPIC, DATA, qos=QOS) 
    client.loop()
