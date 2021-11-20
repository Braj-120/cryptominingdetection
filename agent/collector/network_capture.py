import pyshark

def live_capture(n_interface):
    capture = pyshark.LiveCapture(interface=n_interface)
    capture.sniff(timeout=50)
    print(capture)

live_capture('eth0')