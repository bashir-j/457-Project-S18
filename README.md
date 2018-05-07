# 457-Project-S18
Using Beacons for interactive learning in a museum environment.

# Team Members
Leen 57106, Bashir 57123, Omar 57603

# Project Breakdown
The project consists of 3 main components:
- Ionic App
- Node.js/Express Server
- Content & User DB

# Project Setup
Please follow these steps in order get this project up and running
## Ionic App Setup
Download all files that are in the folder "phase3", head to  / / / , and at the top of the file, edit the string "url" to the IP/PORT of the machine running the server.

Then using your command prompt, cd into the directory, and run:
    ionic cordova build android --device
or whichever platform you would like

Your app should be up and running!

## Server Setup
Download the two files in the "Server" folder, and run ip_server_no_cookie.js using node, your server should be working now!

## CouchDB Setup
Download the two files in the "Database" folder, and place both json objects in a new CouchDB database called ip_proj_data. The "_id" field represents a combination of the major+minor of the beacon in that room.
