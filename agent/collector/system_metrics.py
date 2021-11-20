import psutil
import configparser
import time

config = configparser.ConfigParser()
config.read('config.ini')
counter = 0


def fetch_metrics() -> str:
    """
    Fetches metrics from the system
    """

    final_string = ""
    # CPU Metrics overall
    cpu_details = psutil.cpu_times()
    cpu_details_string = ""
    for b in cpu_details:
        cpu_details_string = cpu_details_string + str(b) + ","
    cpu_percent_avg = [
        x / psutil.cpu_count() * 100 for x in psutil.getloadavg()][1]
    cpu_details_string = cpu_details_string + \
        str(cpu_percent_avg) + "," + str(psutil.cpu_percent(interval=None))

    # print("cpu details:" + cpu_details_string)
    cpu_times_per_cpu = psutil.cpu_times(percpu=True)
    cpu_details_per_cpu_string = ""
    for i in range(psutil.cpu_count(logical=False)):
        cpu_details_per_cpu_string_x = ""
        for b in cpu_times_per_cpu[0]:
            cpu_details_per_cpu_string_x = cpu_details_per_cpu_string_x + \
                str(b) + ","
        # print(f"cpu core {i} details:"+ cpu_details_per_cpu_string_x)
        cpu_details_per_cpu_string = cpu_details_per_cpu_string + cpu_details_per_cpu_string_x
    # print(f"cpu core details: {cpu_details_per_cpu_string}")

    # Memory details
    virtual_memory = psutil.virtual_memory()
    virtual_memory_string = ""
    for b in virtual_memory:
        virtual_memory_string = virtual_memory_string + str(b) + ","
    # print("virtual memory:" + virtual_memory_string)
    swap_memory = psutil.swap_memory()
    swap_memory_string = ""
    for b in swap_memory:
        swap_memory_string = swap_memory_string + str(b) + ","
    # print("swap memory:" + swap_memory_string)

    # Disk IO details
    disk_usage = psutil.disk_usage('/')
    disk_usage_string = ""
    for b in disk_usage:
        disk_usage_string = disk_usage_string + str(b) + ","
    # print("disk usage:" + disk_usage_string)
    disk_io_counters = psutil.disk_io_counters()
    disk_io_counters_string = ""
    for b in disk_io_counters:
        disk_io_counters_string = disk_io_counters_string + str(b) + ","
    # print(f"disk io counters {disk_io_counters_string}")

    # Network details
    net_io_counters = psutil.net_io_counters(nowrap=True)
    net_io_counters_string = ""
    for b in net_io_counters:
        net_io_counters_string = net_io_counters_string + str(b) + ","

    # print(f"net IO counters: {net_io_counters_string}")
    # Timestamp
    timestamp = int(time.time())

    final_string = cpu_details_string + cpu_details_per_cpu_string + \
        virtual_memory_string + swap_memory_string + \
        disk_usage_string + disk_io_counters_string + \
        net_io_counters_string + str(timestamp)

    return(final_string)


def main():
    try:
        metrics_row = fetch_metrics()
        print(metrics_row)
    except Exception as err:
        print(err)


if __name__ == "__main__":
    main()
