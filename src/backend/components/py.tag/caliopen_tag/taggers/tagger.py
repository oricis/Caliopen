# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging

from nltk.tokenize import word_tokenize

import fastText

log = logging.getLogger(__name__)
resources_path = "/home/estelle/Projects/Caliopen/github/Caliopen/src/backend/components/py.tag/caliopen_tag/resources/"

class MessageTagger(object):
    """Tag a message using a tagging model"""

    def __init__(self, cat=None, k=5, threshold=0):
        try:
            self.model = fastText.load_model(resources_path + "models/model{}.ftz".format("_" + cat if cat else ""))
            # TODO Where to store the model ?
            log.info('Load tagging model {}'.format(cat if cat else ""))
        except ValueError as exc:
            log.error('Error loading tagging model {}: {}'.format(cat if cat else "", exc))
            raise exc
        self.k = k
        self.threshold = threshold


    def process(self, msg):
        """Qualification for a message.

        It will first remove any \n because predict processes one line only.
        Then it will tokenizes the message with the same tokenizer as used for training data.
        Afterwards, it will predict tag and return tag + prediction.
        Finally, it will remove the __label__ prefix to predicted tags.
        """
        msg = msg.replace("\n", " ")
        msg = ' '.join(word_tokenize(msg))  # TODO: Add language support
        predictions = self.model.predict(msg, k=self.k, threshold=self.threshold)
        result = [(predictions[0][i][9:], predictions[1][i]) for i in range(self.k)]
        return result
