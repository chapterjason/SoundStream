#!/bin/bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "You need to run this script as root"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1090
. "$SCRIPT_DIRECTORY/../.configuration"

systemctl stop airplay-playback

###################################
###################################
echo "Create airplay service"
###################################
###################################
cat <<EOF > /etc/systemd/system/airplay-playback.service
[Unit]
Description=Airplay Playback
After=syslog.service

[Service]
ExecStartPre=/bin/sleep 3
ExecStart=/usr/local/bin/shairport-sync --output=alsa --name=$HOSTNAME
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=Airplay-Playback
User=shairport-sync

[Install]
WantedBy=multi-user.target
EOF

###################################
###################################
echo "Reload systemctl daemon"
###################################
###################################
systemctl daemon-reload

systemctl start airplay-playback

systemctl stop airplay-playback
