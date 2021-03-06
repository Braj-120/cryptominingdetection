import psutil
import configparser
import csv
import time
import gpu
import traceback


config = configparser.ConfigParser()
config.read('config.ini')


def fetch_metrics() -> str:
    """
    Fetches metrics from the system
    """

    final_string = ""
    # CPU Metrics overall
    cpu_details = psutil.cpu_times_percent()
    cpu_details_string = ""
    for b in cpu_details:
        cpu_details_string = cpu_details_string + str(b) + ","
    cpu_percent_avg = [
        x / psutil.cpu_count() * 100 for x in psutil.getloadavg()][1]
    cpu_details_string = cpu_details_string + \
        str(cpu_percent_avg) + "," + str(psutil.cpu_percent(interval=None, percpu=False)) + ","

    # print("cpu details:" + cpu_details_string)
    cpu_times_per_cpu = psutil.cpu_times_percent(percpu=True)
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
        net_io_counters_string + gpu.get_gpu_details() + \
        str(timestamp)

    return(final_string)


def generate_header() -> str:
    """
    Generates header 
    """
    header_string = ""
    cpu_header_string = "cpu_user,cpu_nice,cpu_system,cpu_idle,cpu_iowait," + \
        "cpu_irq,cpu_softirq,cpu_steal,cpu_guest,cpu_guest_nice," + \
        "cpu_percent_avg,cpu_percent"
    header_string = header_string + cpu_header_string + ","
    cpu_per_core_header_string = ""

    cpu_header_string = cpu_header_string[0:-28]
    for i in range(psutil.cpu_count()):
        for b in cpu_header_string.split(","):
            cpu_per_core_header_string = cpu_per_core_header_string + \
                b + "_" + str(i) + ","

    header_string = header_string + cpu_per_core_header_string

    mem_header = "mem_total,mem_available,mem_percent,mem_used,mem_free," + \
        "mem_active,mem_inactive,mem_buffers,mem_cached,mem_shared,mem_slab,"
    swap_header = "swap_total,swap_used,swap_free,swap_percent,swap_sin,swap_sout,"

    disk_header = "disk_total,disk_used,disk_free,disk_percent," + \
        "disk_read_count,disk_write_count,disk_read_bytes,disk_write_bytes,disk_read_time,disk_write_time," + \
        "disk_read_merged_count,disk_write_merged_count,disk_busy_time,"

    net_header = "net_bytes_sent,net_bytes_recv,net_packets_sent,net_packets_recv,net_errin,net_errout,net_dropin,net_dropout,"
    header_string = header_string + mem_header + \
        swap_header + disk_header + net_header + gpu.get_header() + "timestamp"

    return header_string

counter = 0
def loop(csv_file_path:str):
    """
        Iterates infinitely to fetch metrics
        csv_file_path: The file path
    """
    global counter 
    try:
        while(True):
            current_row = fetch_metrics()
            with open(csv_file_path, newline="", mode="a+") as csvfile:
                csvwriter = csv.writer(csvfile)
                csvwriter.writerow(current_row.split(','))
                print('written')    
            counter = 0
            time.sleep(int(config['Default']['CaptureDelay']))
    except Exception as err:
        counter = counter + 1
        if counter > 5:
            print('5 consecutive error detected, breaking, last error' + err)
        else:
            loop(csv_file_path)



def main():
    try:
        header = generate_header()
        csv_file_path = config['Default']['ExportPath']
        with open(csv_file_path, newline="", mode="w+") as csvfile:
            csvfile.writelines(header)
            csvfile.writelines('\n')
    except Exception as err:
        print(err)
    
    try:
        loop(csv_file_path)
    except Exception as err:
        print(err)
        traceback.print_exc()


if __name__ == "__main__":
    main()
