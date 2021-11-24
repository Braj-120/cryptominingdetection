from datetime import datetime
import traceback
import requests
import socket
import configparser
from os.path import exists
from requests.models import HTTPError
from comms import comm_util

config = configparser.ConfigParser()
config.read('config.ini')
token = ""


def _get_content(token: str):
    """
    Retreives the content as csv from the server
    @params token: auth bearer token
    """
    try:
        hostname = socket.gethostname()
        headers = {
            "hostname": hostname,
            "authorization": "Bearer " + token
        }
        url = config['Content_Server']['uri'] + \
            config['Content_Server']['content_get_route']
        content_file_path = config['Default']['content_file_path']
        with requests.get(url, headers=headers, stream=True) as r:
            if (r.status_code == 403):
                return False
            r.raise_for_status()
            with open(content_file_path, mode='wb') as file:
                for chunk in r.iter_content(chunk_size=256):
                    file.write(chunk)
        print(f"{str(datetime.now())}: Content file written")
        return True
    except HTTPError as httperr:
        print(f'{str(datetime.now())}: Http error detected')
        raise(httperr)


def main():
    """
    Master method to drive the content retrieval
    """
    try:
        creds_file = config['Default']['cred_file']
        token_file = config['Content_Server']['token_file']
        if (not exists(creds_file)):
            raise Exception(
                'Cred file does not exist. Please place cred file in JSON format. Password should be encrypted')
        global token
        url = config['Content_Server']['uri'] + \
            config['Content_Server']['auth_post_route']
        if(token == ""):
            token = comm_util.retrieve_token(token_file, creds_file, url)
        if (not _get_content(token)):
            print(
                f'{str(datetime.now())}Token has either expired or invalid, fetching new token and retrying')
            token = comm_util.retrieve_token(token_file, creds_file, url, True)
            _get_content(token)
    except Exception as ex:
        print(str(datetime.now()) + ":")
        traceback.print_exc()
        print('Failed to get the content. If content exists, older content will be used, else program will exit')
