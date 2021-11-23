from datetime import datetime
from typing import Union
import pyshark
import psutil
import csv
import asyncio.exceptions
import traceback

output = None


def load_content(content_file_path):
    with open(content_file_path, 'r') as file:
        content = list(csv.DictReader(file))
        return content


class MatchFound(Exception):
    pass


capture = None
content = ""


def match_network_call(packet):
    """
    For each packet, it tries to find the soruce, dest IP address and protocol and then match to the content file,
    for a given period of time,
    @param packet: Pyshark captured packet object 
    """
    global output
    try:
        # get packet content
        protocol = packet.transport_layer   # protocol type
        src_addr = packet.ip.src            # source address
        src_port = packet[protocol].srcport   # source port
        dst_addr = packet.ip.dst            # destination address
        dst_port = packet[protocol].dstport   # destination port
        # output packet info
        print(
            f"IP -> {src_addr}:{src_port} -> {dst_addr}:{dst_port} at {protocol}")

        # match packet
        for row in content:
            if (row['address'] == dst_addr and row['port_number'] == dst_port):
                print(
                    f"{str(datetime.now())}: Network call Match found for {dst_addr}, {dst_port}, {protocol}, row: {row}")
                output = row
                raise MatchFound()
            elif (row['address'] == src_addr and row['port_number'] == src_port):
                print(
                    f"{str(datetime.now())}: Network call Match found for {src_addr}, {src_port}, {protocol}, row: {row}")
                output = row
                raise MatchFound()
    except AttributeError as e:
        # ignore packets other than TCP, UDP and IPv4
        pass


def main(capture_time: int, content_file_path: str) -> Union[dict, None]:
    """
    Method to start a network monitor which will capture the packets to find if a known communication between 
    host and a mining pool is active.
    If yes, then it returns the details of that connection.
    @param capture_time: In seconds, time till capturing is needed.
    """
    try:
        addrs = psutil.net_if_addrs()
        print("%s: listening on %s" % (str(str(datetime.now())), addrs.keys()))
        global content
        global capture
        content = load_content(content_file_path)
        # define capture object
        capture = pyshark.LiveCapture(addrs.keys())
        capture.apply_on_packets(match_network_call, capture_time)
    except MatchFound:
        return output
    except asyncio.exceptions.TimeoutError:
        return output
    except Exception:
        print(str(datetime.now()) + ":")
        traceback.print_exc()
        return output
    finally:
        capture.close()
        capture.clear()
