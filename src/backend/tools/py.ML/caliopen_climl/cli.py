"""Command Line Interface (CLI) for caliopen machine learning tasks."""
import click

from caliopen_tag.models_manager import ModelManager, ESDataManager
from caliopen_data import save_file


class Config(object):
    """Delay configuration load and storage connection."""

    def __init__(self, filename):
        from caliopen_storage.config import Configuration
        from caliopen_storage.helpers.connection import connect_storage
        self.conf = Configuration.load(filename, 'global').configuration
        connect_storage()


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
        manager = ModelManager(provider)
        result_file = manager.get_new_model(output)
        save_file(config, result_file, model)
    else:
        click.echo('Unknow model {0}'.format(model))
