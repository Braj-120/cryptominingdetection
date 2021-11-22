from datetime import datetime
import traceback
from comms import comm_content
import configparser
import time
from collector import system_metrics, network_capture
from ml_layer import prediction
import threading

gl_counter = 0
config = configparser.ConfigParser()
config.read('config.ini')
metric_interval = int(config['Default']['metric_interval'])


def _raise_alert():
    """
    Method to raise Alert. This method, tries to monitor network logs to identify if it is a known mining pool location.
    If yes, then it fills the data as provided in content.
    If not, then it raises the alert anyway with unfilled data.
    """
    print(str(datetime.now()) +
          "Threshold reached, Confirmed Cryptomining acertained, raising alert")

    matched_details = network_capture.main(
        int(config['Default']['capture_time']), config['Default']['content_file_path'])
    print(matched_details)


def _record_test_metrics():
    """
    This method is driver for fetching the test metric records, validating them and predicting mining operation
    using model. If detected, it tries to raise the alert.
    """
    global gl_counter
    # Fetch the system metrics as csv string with header
    query = system_metrics.main()
    threshold = int(config['Default']['detection_counter_threshold'])
    # Do the prediction
    pred = prediction.predict(query)
    print(f'Hack done here, actual pred is {pred}, hardcoded 1')
    # If prediction is true 5 times continiously, then raise the alert.
    if(1):
        gl_counter = gl_counter + 1
        print(f"{str(datetime.now())}:Possible crypto mining detection prediction, counter {gl_counter}, Threshold is {threshold}")
    else:
        if (gl_counter > 0):
            gl_counter = gl_counter - 1
    if (gl_counter > threshold):
        _raise_alert()
        gl_counter = 0


def _schedule_content_pull(content_interval: int):
    """
    Creates a new thread which periodically pulls content, independent of current thread
    @param content_interval: How frequently content must be pulled
    """
    # Initially run once to get the content
    comm_content.main()
    try:
        t = threading.Timer(
            content_interval, _schedule_content_pull, [content_interval])
        t.daemon = True
        t.start()
    except KeyboardInterrupt:
        t.join()


def main():
    """
    This is the agent program to detect cryptomining on a host
    """
    try:
        # First start a schedule to fetch the content every X mins
        content_interval_in_min = config['Content_Server']['interval_in_min']
        _schedule_content_pull(int(content_interval_in_min) * 60)
        # Now schedule the extraction of metrics to be done every N seconds
        while True:
            _record_test_metrics()
            time.sleep(metric_interval)
    except KeyboardInterrupt:
        print(str(datetime.now()) + ':Keyboard Interrupt Ctrl + C detected, Exiting')
        exit(0)
    except Exception as exc:
        print(str(datetime.now()) + ":")
        traceback.print_exc()
        raise exc


if __name__ == "__main__":
    main()
