#!/bin/env python

import sys
import argparse
import logging

from caliopen_storage.config import Configuration
from caliopen_storage.helpers.connection import connect_storage

logging.basicConfig(level=logging.INFO)


def shell(**kwargs):
    try:
        from IPython import embed
        from traitlets.config.loader import Config
        cfg = Config()
        cfg.InteractiveShellEmbed.confirm_exit = False
        embed(config=cfg, banner1="Caliopen Shell")
    except ImportError:
        # try ~IPython-0.10 API
        try:
            from IPython.Shell import IPShellEmbed as embed  # noqa
            ipshell = embed(banner="Caliopen Shell")
            ipshell()
        except ImportError:
            import code
            code.interact("Caliopen migration shell", local=locals())


def main(args=sys.argv):
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', dest='conffile', default='caliopen.yaml')
    kwargs = parser.parse_args(args[1:])
    kwargs = vars(kwargs)

    config_uri = kwargs.pop('conffile')
    Configuration.load(config_uri, 'global')
    connect_storage()
    shell(**kwargs)


if __name__ == '__main__':
    main()
