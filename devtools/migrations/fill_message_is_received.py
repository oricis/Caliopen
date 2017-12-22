#!/usr/bin/env python
# coding: utf8
"""Extract recovery emails of registered users."""

from __future__ import unicode_literals

import sys
import argparse
import logging

from caliopen_storage.config import Configuration
from caliopen_storage.helpers.connection import connect_storage
from caliopen_main.common.errors import PatchConflict
from caliopen_storage.exception import NotFound

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', dest='conffile')
    parser.add_argument('-t', dest='test', action='store_true', default=False)

    args = parser.parse_args()
    Configuration.load(args.conffile, 'global')
    connect_storage()
    from caliopen_main.user.core.user import LocalIdentity
    from caliopen_main.message.store.message import Message
    from caliopen_main.message.objects.message import Message as ObjMessage

    identities = [x.identifier for x in LocalIdentity._model_class.all()]
    cpt = {'received': 0, 'sent': 0}
    for message in Message.all():
        if message.is_received is None:
            from_participant = [x for x in message.participants
                                if x['type'] == 'From']
            if not from_participant:
                log.error('No from participant found for message {} : {}'.
                          format(message.message_id, message.participants))
            else:
                is_received = False
                if from_participant[0]['address'] in identities:
                    log.info('Sent mail')
                    cpt['sent'] += 1
                else:
                    log.info('Received mail')
                    cpt['received'] += 1
                    is_received = True
                if not args.test:
                    obj = ObjMessage(message.user_id,
                                     message_id=message.message_id)
                    patch = {'current_state': {'is_received': None},
                             'is_received': is_received}
                    try:
                        error = obj.apply_patch(patch, db=True, index=True)
                        if error is not None:
                            log.error('Unable to patch message {}: {}'.
                                      format(message.message_id, error))
                    except PatchConflict as exc:
                        log.exception('Patch conflict for message {} :{}'.
                                      format(message.message_id, exc))
                    except NotFound as exc:
                        log.exception('Message not found {}: {}'.
                                      format(message.message_id, exc))
                    except Exception as exc:
                        log.exception('Unhandled exception {}'.format(exc))
    print('Total {}'.format(cpt))
