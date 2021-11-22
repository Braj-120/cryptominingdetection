This is a simple collecter service which works on LINUX environment. It collects important system related metrics like CPU, GPU, Memory, Disk and Network every few seconds (configurable) and then logs in a csv file every few seconds(configurable).
GPU details are captured only for NVidia GPUs (currently) and only if they are present.
To run, simply execute start.sh
Edit the config.ini to change collection freq or target file
