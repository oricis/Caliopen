"""
Caliopen Shell using Ipython if available.
"""


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
            from IPython.Shell import IPShellEmbed as embed
            ipshell = embed(banner="Caliopen Shell")
            ipshell()
        except ImportError:
            import code
            code.interact("Caliopen Shell", local=locals())
