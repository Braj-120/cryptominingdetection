from datetime import datetime
import traceback
import requests
import socket
import configparser
import json
from os.path import exists
from requests.models import HTTPError
from cryptography.fernet import Fernet

config = configparser.ConfigParser()
config.read('config.ini')
token = ""


def _get_token(creds: dict):
    """
    Fetches the token for a given credential set
    @params creds: Dictionary containing username and password (unencrypted)
    """
    try:
        hostname = socket.gethostname()
        creds["hostname"] = hostname
        url = config['Content_Server']['uri'] + \
            config['Content_Server']['auth_post_route']
        response = requests.post(url, json=creds)
        return response.text
    except HTTPError as httperr:
        print(
            f'{str(datetime.now())}: Http error detected, below exception, resuming operation')
        print(httperr)


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
        print(httperr)


def _retrieve_token(expired: bool = False):
    """
    Helper method to get token from URL or file depending on scenarios
    @params expired: Is token expired
    """
    # Try to get a token if it is first time or if it has expired
    global token
    if (not exists(config['Default']['token_file']) or expired):
        print(f"{str(datetime.now())}: Fetching new token")
        with open(config['Default']['cred_file'], 'r') as myfile:
            data = myfile.read()
        cred = json.loads(data)
        f = Fernet("jlKb-yoWYc38f2r6-ezMyVszat8UAYkav8F8q2df_N0=")
        cred["password"] = f.decrypt(
            bytes(cred["password"], "utf-8")).decode("utf-8")
        token = _get_token(cred)
        with open(config['Default']['token_file'], 'w') as tfile:
            tfile.write(token)
    else:
        print(f"{str(datetime.now())}: Token file exists, trying to read from file")
        with (open(config['Default']['token_file'], 'r')) as tfile:
            token = tfile.read()


def main():
    """
    Master method to drive the content retrieval
    """
    try:
        creds_file = config['Default']['cred_file']
        if (not exists(creds_file)):
            raise Exception(
                'Cred file does not exist. Please place cred file in JSON format. Password should be encrypted')

        if(token == ""):
            _retrieve_token()
        if (not _get_content(token)):
            print(
                f'{str(datetime.now())}Token has either expired or invalid, fetching new token and retrying')
            _retrieve_token(True)
            _get_content(token)
    except Exception as ex:
        print(str(datetime.now()) + ":")
        traceback.print_exc()
        raise(ex)
