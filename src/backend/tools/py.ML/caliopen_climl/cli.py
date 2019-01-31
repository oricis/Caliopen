"""
Command Line Interface (CLI) for caliopen project


"""
import click

from minio import Minio
from minio.error import BucketAlreadyOwnedByYou, BucketAlreadyExists
from caliopen_tag.models_manager import ModelManager, ESDataManager
import elasticsearch_dsl as dsl


class Config(object):
    """Delay configuration load and storage connection."""

    def __init__(self, filename):
        from caliopen_storage.config import Configuration
        from caliopen_storage.helpers.connection import connect_storage
        self.conf = Configuration.load(filename, 'global')
        connect_storage()


def save_object_store(config, input_file, dest):
    """Save an input file as dest on object store."""
    bucket = config['buckets']['learn_models']
    client = Minio(config["endpoint"],
                   access_key=config["access_key"],
                   secret_key=config["secret_key"],
                   secure=False)
    try:
        client.make_bucket(bucket, config['location'])
    except BucketAlreadyOwnedByYou:
        pass
    except BucketAlreadyExists:
        pass
    except Exception as exc:
        raise exc
    try:
        resp = client.fput_object(bucket, dest, input_file)
        click.echo('Put file {0}: {1}'.format(input_file, resp))
    except Exception as exc:
        click.echo('Unable to save file in object store %r' % exc)
        raise exc


@click.group()
@click.option('--config', 'config')
@click.pass_context
def cli(ctx, config):
    """Entry point."""
    ctx.obj = Config(config).conf


@cli.command()
@click.argument('model')
@click.option('--index', default='all')
@click.option('--output')
@click.pass_obj
def train(config, model, index, output):
    """Train a model command."""
    click.echo('Will train model {0} with index {1}'.
               format(model, index))
    if model == 'tagger':
        provider = ESDataManager(config)
        provider.prepare(provider.get_query(),
                         index=None,
                         doc_type='indexed_message')
        model = ModelManager(provider)
        model.get_new_model(output)
    else:
        click.echo('Unknow model {0}'.format(model))
