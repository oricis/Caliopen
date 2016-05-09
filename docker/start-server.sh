#!/bin/bash

[[ -z ${CALIOPEN_VIRTUAL_MAILBOX_DOMAINS} ]] && echo "unable to find CALIOPEN_VIRTUAL_MAILBOX_DOMAINS" && exit 1
postconf -e virtual_mailbox_domains=${CALIOPEN_VIRTUAL_MAILBOX_DOMAINS}

[[ ! -z ${CALIOPEN_VIRTUAL_TRANSPORT} ]] && postconf -e virtual_transport=${CALIOPEN_VIRTUAL_TRANSPORT}

caliopen/smtp/bin/lmtpd.py -f /caliopen.yaml 2>&1 >> /var/log/lmtp.log &
service rsyslog start
service postfix start
# Wait for postfix to start
sleep 1

tail -f /var/log/mail.log /var/log/lmtp.log
