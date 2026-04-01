# Gespräch mit Khalig:  

## Gespräch vom 20-03-2026

## Wir:  
 Wie verbinden wir uns das erste Mal mit dem Gateway, um die Einstellung zu sehen?  

## Antwort-Khalig:  

 Das Gateway benötigt Strom (usb-c) und Ethernet über den Ethernet-Port.  
  Dann taucht es automatisch im Netzwerk aus, sofern es eine DHCP zugewiesen bekommt.  
   Wenn Ihr das Gerät bei euch daheim an die Fritzbox hängen würdet, könntet ihr es einfach unter Netzwerk als Gerät finden.  
    Das Gerät sollte AVA1 heißen (oder ähnlich).  
     Wenn ihr das gerät gefunden habt, einfach auf die IP-Adresse im Browser zugreifen, dann kommt ihr auf einen Webserver auf de Gerät.  
      Es gibt hier keine Login Daten die nötig sind, man kommt direkt auf die Oberfläche und kann mit der Konfiguration starten.  



## Wir:  

Gibt es Standard-Zugangsdaten (Benutzername/ Passwort) für die Weboberfläche?  

## Antwort-Khalig:  
S.o. keine Logindaten nötig  


## Wir:  

Benötigen wir spezielle Software, um die Daten der Sensoren am Gateway zu empfangen?  

## Antwort-Khalig:  

Ich verstehe die Frage nicht so richtig.  
 Mit mioty benötigt man- analog zu LoRawan- ein Netzwerk- und Application-Center.  
  Man kann auf der WEPTECH Oberfläche erste sensoren hinzufügen und testen ob das system funktioniert, aber wenn man wie Ihr in ein eigenes Application-Center die Daten senden möchte, benötigt ihr den BSSCI-Schnittstellenmodus und ein Service-Center für den Betrieb.  
   Ich würde euch dafür das Service-Center empfehlen, dass ich gebaut habe. Ihr findet es hier:  
   
   [plasmonized/containerized-mioty-Service-Center](https://github.com/plasmonized/containerized-mioty-Service-Center): This is a basic implementation of the mioty BSSCI protocol into an open source servicecenter with GUI. The serviccenter connects automatically to basestations over BSSCI and aggregates the data onto a MQTT Broker you have to provide.  

   Ihr müsstet das Servicecenter einfach als Docker Container auf einem Server eurer Wahl installieren und dann das WEPTECH Gateway dort integrieren.  
    Aber ein schritt nach dem anderen- jetzt nehmt erstmal das WEPTECH Gateway in betrieb und versucht mal mit mioty Sensordaten dort zu empfangen, danach können wir gerne das Servicecenter integrieren.


--- 
# Inbetriebnahme Gateway

IPad mit WLan verbinden: IoT ,,HGS-WLan-IoT,,

- Passwort: IoTHGSTG133

IP: 10.85.33.236

## Sensor Daten Sensor Neu

- EUI -> Box
- ShAddr: letzte 4 Zahlen von EUI
- PreAtt aktivieren
- Network key folgt
- Applications key folgt

# Gesrpäch vom 27.03.2026  

**Wir:**  
Guten Tag Alex, 
Wir sind noch einmal auf Fragen gestoßen für die wir dich bräuchten.
Wir brächten den Application Key und den Network Key .
Und was wäre der EUI Typ? 
MfG,  

**Khalig:**  
Zum registrieren der Sensoren bei mioty braucht ihr nur EUI, Network Key und Short Address. Ist etwas anders wie bei lora

 



 

 

**APOQ57189 EUI: FCA84A01000036C8 -> Network Key: 1FBAC79CA83DC2E40F5372EAC20493BB   short adrress: 36C8**    
**APOQ57198 EUI: FCA84A01000036C9  -> Network Key: B92C28AD997CA3E17893A611BB2A2358 short adrress: 36C9**  
***Die short address sind immer die letzten 2 Bytes der EUI.***    

 
