# Crypto Mining Detection Engine
This work is part of Dissertation Project for 4th Semester BITS MTech.

The work is designed to train a ML model to do cryptomining detection, and then package the model in a python package,
which can run on a linux agent at any time, to readily do detection of possible cryptomining activity.
The program also uses a content server, to match any detections to that of a known mining pool.

It then uses generates an alert which is then posted and stored on a reporting server. The reporting server shows a dashboard.

There are 6 main parts

<b>Collectors</b> - A simply python utility which was used to generate training data

<b>Training Data</b> - Training data generated during the process.

<b>dummyloadtesting</b> - This is a simple node server and a locust test, to simulate a load on system. It was used while generating training data. Useful for systems with 1-2 Cores and low memory like VMs. Not very useful for servers.

<b>Agent</b> - The python agent code, which actually uses the ML model and content from content server to do realtime detections and generate alerts.

<b>Reporting Server</b> - A Node.js server to collect all alerts. It then shows all the alerts in a nicely curated dashboard

<b>Content Server</b> - This is a fork on Jane-Smashed project. An API server has been added to it to download the content. Code is present here: https://github.com/Braj-120/jane-smashed
