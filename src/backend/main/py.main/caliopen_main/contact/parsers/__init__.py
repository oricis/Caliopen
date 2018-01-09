# -*- coding: utf-8 -*-
"""Caliopen vcard parsing."""
from __future__ import absolute_import, print_function, unicode_literals

from .vcard import VcardContact

import os
import vobject


def parse_vcard(vcard):
    """Parse a vcard input and produce a ``NewContact``."""
    parser = VcardContact(vcard)
    return parser.contact


def parse_vcards(vcards):
    """Parse a list of vcard, return an iterator of parsed entries."""
    for v in vcards:
        yield parse_vcard(v)


def read_file(file_vcard, test):
    """Read a vcf file and returns parsed vcards."""
    vcards = []
    if test:
        ext = file_vcard.split('.')[-1]
        if ext == 'vcard' or ext == 'vcf':
            with open('{}'.format(file_vcard), 'r') as fh:
                vcards_tmp = vobject.readComponents(fh)
                for v in vcards_tmp:
                    vcards.append(v)
    else:
        vcards = vobject.readComponents(file_vcard)
    return vcards


def read_directory(directory):
    """Read all vcf files in a directory and return parsed vcards."""
    vcards = []
    files = [f for f in os.listdir(directory) if
             os.path.isfile(os.path.join(directory, f))]
    for f in files:
        ext = f.split('.')[-1]
        if ext == 'vcard' or ext == 'vcf':
            with open('{directory}/{file}'.
                      format(directory=directory, file=f), 'r') as fh:
                vcards_tmp = vobject.readComponents(fh)

                for v in vcards_tmp:
                    vcards.append(v)
    return vcards
