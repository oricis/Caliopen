# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging

from ..utils import pre_process, resources_path

import fastText

log = logging.getLogger(__name__)


class MessageTagger(object):
    """Tag a message using a tagging model"""

    def __init__(self, model_name="model_cat1", k=5, threshold=0):
        try:
            self.model = fastText.load_model(
                resources_path + "models/{}.bin".format(model_name)
            )
            log.info('Load tagging model {}'.format(model_name))
        except ValueError as exc:
            log.error(
                'Error loading tagging model {}: {}'.format(model_name, exc)
            )
            raise exc
        self.k = k
        self.threshold = threshold

    def process(self, msg):
        """Qualification for a message.

        It will first remove any \n because predict processes one line only.
        Then it will tokenize the message with the same tokenizer as the one
        used for the training data.
        Afterwards, it will predict tag and return tag + prediction.
        Finally, it will remove the __label__ prefix to predicted tags.
        """
        text = pre_process(msg.body_plain, html=True)
        # TODO: Add language support + check if msg.body_plain is html ?

        predictions = self.model.predict(
            text,
            k=self.k,
            threshold=self.threshold
        )
        nb_result = len(predictions[0])
        result = [
            (predictions[0][i][9:], predictions[1][i])
            for i in range(nb_result)
        ]
        return result
