#!/bin/env python
# -*- coding: utf-8 -*-
"""
Simple script to inject a mail into a caliopen instance for testing purposes.

Usage:
    inject_mail.py -f <from address> -t <to address> -m <mail file>

"""
from __future__ import unicode_literals

import sys
import argparse
import smtplib


def send_fake_mail(fromaddr, toaddrs, file, host, port):

    # Add the From: and To: headers at the start!
    msg = ("From: %s\r\nTo: %s\r\n\r\n"
           % (fromaddr, ", ".join(toaddrs)))
    with open(file) as f:
        mail = f.read()
        msg = msg.encode('ascii') + mail
        print("Message length is " + repr(len(msg)))
        server = smtplib.SMTP(host, port)
        server.set_debuglevel(1)
        server.sendmail(fromaddr, toaddrs, msg)
        server.quit()


if __name__ == '__main__':
    args = sys.argv
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', dest='from_')
    parser.add_argument('-t', dest='to')
    parser.add_argument('-m', dest='mail')
    parser.add_argument('-h', dest='host', default='localhost')
    parser.add_argument('-p', dest='port', default=4025)
    opts = parser.parse_args(args[1:])
    send_fake_mail(opts.from_, [opts.to], opts.mail)
