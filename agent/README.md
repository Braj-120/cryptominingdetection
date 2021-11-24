##To setup the agent, you must run following
```
pip install -r requirements.txt
apt-get install tshark
chmod +x /usr/bin/dumpcap
```
Then, start the main.py using startup.sh
This works only on linux environment as certain parameters extracted are platform dependent. 
One can migrate this easily to other platforms though.