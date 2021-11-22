import GPUtil


def get_gpu_details():
    """
    Gets the GPU details if GPU is present
    """
    gpus = GPUtil.getGPUs()
    out = ""
    list_gpus = []
    for gpu in gpus:
        # get the GPU id
        gpu_id = gpu.id
        # get % percentage of GPU usage of that GPU
        gpu_load = gpu.load*100
        # get free memory in MB format
        gpu_free_memory = gpu.memoryFree
        # get used memory
        gpu_used_memory = gpu.memoryUsed
        # get total memory
        gpu_total_memory = gpu.memoryTotal
        # get GPU temperature in Celsius
        gpu_temperature = gpu.temperature
        gpu_uuid = gpu.uuid
        list_gpus.append(','.join([str(elem) for elem in [
            gpu_id, gpu_load, gpu_free_memory, gpu_used_memory,
            gpu_total_memory, gpu_temperature, gpu_uuid
        ]]))
    out = ','.join([str(elem) for elem in list_gpus])
    return out


def get_header():
    """
    Get the header string for GPUs
    """
    gpus = GPUtil.getGPUs()
    headers = ["id", "load", "free_memory_in_mb", "used_memory_in_mb",
               "total_memory_in_mb", "temperature_in_C", "uuid"]
    header_string = ""
    for i in range(len(gpus)):
        for elem in headers:
            header_string = header_string + "gpu_" + elem + "_" + str(i) + ","
    return header_string
