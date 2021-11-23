from datetime import datetime
import traceback
import requests
import socket
import configparser
from comms import comm_util
from os.path import exists
from requests.models import HTTPError

config = configparser.ConfigParser()
config.read('config.ini')
token = ""


def _post_alert(data: dict, token: str):
    """
    Posts the alert to reporting server
    @param data: Data to post
    @params token: auth bearer token
    """
    try:
        hostname = socket.gethostname()
        headers = {
            "hostname": hostname,
            "authorization": "Bearer " + token
        }
        url = config['Reporting_Server']['uri'] + \
            config['Reporting_Server']['alert_post_route']

        response = requests.post(url, headers=headers, json=data)
        if (response.status_code == 403):
            return False
        response.raise_for_status()
        print(f"Alert posted Successfully")
        return True
    except HTTPError as httperr:
        print(f'{str(datetime.now())}: Http error detected')
        raise(httperr)


def main(data: dict):
    """
    Master method to drive the content retrieval
    @data: Data to post
    """
    try:
        creds_file = config['Default']['cred_file']
        token_file = config['Reporting_Server']['token_file']
        if (not exists(creds_file)):
            raise Exception(
                'Cred file does not exist. Please place cred file in JSON format. Password should be encrypted')
        global token
        url = config['Reporting_Server']['uri'] + \
            config['Reporting_Server']['auth_post_route']
        if(token == ""):
            token = comm_util.retrieve_token(token_file, creds_file, url)
        if (not _post_alert(data, token)):
            print(
                f'{str(datetime.now())}Token has either expired or invalid, fetching new token and retrying')
            token = comm_util.retrieve_token(token_file, creds_file, url, True)
            _post_alert(data, token)
    except Exception as ex:
        print(str(datetime.now()) + ":")
        traceback.print_exc()
