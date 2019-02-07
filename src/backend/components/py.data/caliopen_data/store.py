"""Methods to interact with data store for file related to data analyse."""
from __future__ import absolute_import, print_function, unicode_literals

import logging
from minio import Minio
from minio.error import BucketAlreadyOwnedByYou, BucketAlreadyExists

log = logging.getLogger(__name__)


def save_file(config, input_file, dest):
    """Save an input file as dest on object store."""
    conf = config['object_store']
    bucket = conf['buckets']['learn_models']
    client = Minio(conf["endpoint"],
                   access_key=conf["access_key"],
                   secret_key=conf["secret_key"],
                   secure=False)
    try:
        client.make_bucket(bucket, conf['location'])
    except BucketAlreadyOwnedByYou:
        pass
    except BucketAlreadyExists:
        pass
    except Exception as exc:
        raise exc
    try:
        resp = client.fput_object(bucket, dest, input_file)
        log.info('Put file {0}: {1}'.format(input_file, resp))
    except Exception as exc:
        log.info('Unable to save file in object store %r' % exc)
        raise exc
