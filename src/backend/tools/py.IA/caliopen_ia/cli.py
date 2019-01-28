"""
Command Line Interface (CLI) for caliopen project


"""
import click


class Config(object):
    """Delay configuration load and storage connection."""

    def __init__(self, filename):
        from caliopen_storage.config import Configuration
        from caliopen_storage.helpers.connection import connect_storage
        self.conf = Configuration.load(filename, 'global')
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
@click.pass_obj
def train(obj, model, index):
    """Train a model command."""
    click.echo('Will train model {0} with index {1}'.
               format(model, index))
