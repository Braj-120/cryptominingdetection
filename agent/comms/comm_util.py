from datetime import datetime
import requests
import socket
import json
from os.path import exists
from requests.models import HTTPError
from cryptography.fernet import Fernet

def get_token(creds: dict, url: str):
    """
    Fetches the token for a given credential set
    @params creds: Dictionary containing username and password (unencrypted)
    @url: URL to get the token from
    """
    try:
        hostname = socket.gethostname()
        creds["hostname"] = hostname
        response = requests.post(url, json=creds)
        return response.text
    except HTTPError as httperr:
        print(
            f'{str(datetime.now())}: Http error detected, below exception, resuming operation')
        print(httperr)


def retrieve_token(token_file: str, cred_file: str, token_url: str, expired: bool = False):
    """
    Helper method to get token from URL or file depending on scenarios
    @token_file: Token file location
    @cred_file: Credential file
    @token_url: URL to get the token from if not avaiable locally
    @params expired: Is token expired
    """
    # Try to get a token if it is first time or if it has expired
    if (not exists(token_file) or expired):
        print(f"{str(datetime.now())}: Fetching new token")
        with open(cred_file, 'r') as myfile:
            data = myfile.read()
        cred = json.loads(data)
        f = Fernet("jlKb-yoWYc38f2r6-ezMyVszat8UAYkav8F8q2df_N0=")
        cred["password"] = f.decrypt(
            bytes(cred["password"], "utf-8")).decode("utf-8")
        token = get_token(cred, token_url)
        with open(token_file, 'w') as tfile:
            tfile.write(token)
    else:
        print(f"{str(datetime.now())}: Token file exists, trying to read from file")
        with (open(token_file, 'r')) as tfile:
            token = tfile.read()
    return token