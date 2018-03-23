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


def send_fake_mail(fromaddr, toaddrs, file, subject, content_type, host, port):
    # add useful headers. NB: do not add leading spaces in header lines
    msg = (
'''MIME-Version: 1.0
From: {}
To: {}
Subject: {}
Content-Type: {}; charset=UTF-8
Content-Transfer-Encoding: quoted-printable

'''.format(fromaddr, ", ".join(toaddrs), subject, content_type))

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
    parser.add_argument('-t', dest='to', default='dev@caliopen.local')
    parser.add_argument('-s', dest='subject',
                        default='mail from inject_mail.py')
    parser.add_argument('-c', dest='content_type', default='text/plain')
    parser.add_argument('-m', dest='mail')
    parser.add_argument('-o', dest='host', default='localhost')
    parser.add_argument('-p', dest='port', default=2525)
    opts = parser.parse_args(args[1:])
    send_fake_mail(opts.from_, [opts.to], opts.mail, opts.subject,
                   opts.content_type, opts.host, opts.port)
