To run

1. First run node server using
```
cd node_server
npm i
nohup node server.js &
```

2. Then run locust using - (you can use virtualenv)
```
cd ../locust_py
pip install -r requirements.txt
nohup locust -f locust_test.py --headless --only-summary --users 2 --spawn-rate 2 -H http://localhost:3000 &
```

To stop, find process and kill.
