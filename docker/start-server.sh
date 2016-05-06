#!/bin/bash

[[ -z ${CALIOPEN_VIRTUAL_MAILBOX_DOMAINS} ]] && echo "unable to find CALIOPEN_VIRTUAL_MAILBOX_DOMAINS" && exit 1

postconf -e virtual_mailbox_domains=${CALIOPEN_VIRTUAL_MAILBOX_DOMAINS}
postconf -e virtual_transport=lmtp:127.0.0.1:4000

caliopen/smtp/bin/lmtpd.py -f /caliopen.yaml 2>&1 >> /var/log/lmtp.log &
service rsyslog start
service postfix start
# Wait for postfix to start
sleep 1

tail -f /var/log/mail.log /var/log/lmtp.log
