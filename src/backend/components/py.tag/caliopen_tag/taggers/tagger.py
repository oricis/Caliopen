# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging
from bs4 import BeautifulSoup

from nltk.tokenize import word_tokenize

import fastText

log = logging.getLogger(__name__)
resources_path = "/path/to/resources/"


class MessageTagger(object):
    """Tag a message using a tagging model"""

    def __init__(self, model_name="cat1", k=5, threshold=0):
        try:
            self.model = fastText.load_model(
                resources_path + "models/model_{}.ftz".format(model_name)
            )
            # TODO Where to store the model ?
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
        text = prepare_msg(msg)  # TODO: Add language support
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


def prepare_msg(msg):
    text = extract_text(msg)
    text = text.replace("\n", " ")
    # Because FastText doesn't accept newline char
    text = ' '.join(word_tokenize(text))
    text = text.lower()
    return text


def extract_text(msg):
    soup = BeautifulSoup(msg, "html.parser")
    return soup.text
