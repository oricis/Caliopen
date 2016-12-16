class PatchUnprocessable(Exception):

    """Exception when patch dict is malformed or unprocessable."""
    pass


class PatchError(Exception):

    """Exception when processing patch was unsuccessfull"""
    pass
