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
Download the `phase3.zip` file in the folder "AppFiles" and extract it.
Head to the file phase3/www/js/controllers.js , and at the top of the file, edit the string const "url" to the IP/PORT of the machine running the server.

Then using your command prompt, cd into the directory phase3, and run:

    ```ionic cordova platform add <platform>
       ionic cordova build <platform> --device
    ```
Your app should be up and running!

## Server Setup
Download the two files in the "ServerFiles" folder, and run ip_server_no_cookie.js using node, your server should be working now!

## CouchDB Setup
Download the two files in the "DatabaseFiles" folder, and place both json objects in a new CouchDB database called ip_proj_data. The "_id" field represents a combination of the major+minor of the beacon in that room.
