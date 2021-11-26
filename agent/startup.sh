
echo "This script works on Ubuntu and debian systems and used to install tshark utility before starting the program"
echo "If you are on any other variant of linux, install tshark manually, then run following commands"
echo "sudo chmod +x /usr/bin/dumpcap"
echo "pip install -r requirements.txt"
echo "python3 main.py"

isPackageNotInstalled() {

    dpkg --status $1 &> /dev/null
    if [ $? -eq 0 ]; then
    echo "$1: Already installed"
    else
    sudo apt-get install -y $1
    sudo chmod +x /usr/bin/dumpcap
    fi
    }

isPackageNotInstalled tshark

echo "Installing Python dependencies"
pip install -r requirements.txt

echo "Starting"
python3 main.py