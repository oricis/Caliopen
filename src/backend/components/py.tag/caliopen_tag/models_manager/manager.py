# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging
import os
from tempfile import NamedTemporaryFile
from nltk.tokenize import word_tokenize

import fastText

log = logging.getLogger(__name__)
resources_path = "/path/to/resources/"


def labelling(msg):
    labels = msg.get_tags()
    labels = ['__label__' + label for label in labels]
    return ' '.join(labels)


def fetch_data():
    # TODO: implement fetching data from cassandra
    return []


class ModelManager(object):
    """
    Manage tagging model:
     - training a new model
    """

    def __init__(
            self,
            cat="cat1",
            use_pre=True,
            epoch=15,
            lr=0.1,
            word_n_grams=2,
            min_count=40,
            dim=100,
            loss="softmax",
            thread=12,
            neg=5):
        self.cat = cat  # Check cat is available. Use int ?
        self.use_pre = use_pre
        self.epoch = epoch
        self.lr = lr
        self.wordNgrams = word_n_grams
        self.minCount = min_count
        self.dim = dim
        self.loss = loss
        self.thread = thread
        self.neg = neg

    def get_new_model(self, output):
        """Get a new model and save it in resources/models/output.

        It first fetches the data from cassandra and write it to a temporary
        file, following the fastText format.
        Then it pre-processes the data (tokenization + lowercase).
        Then it trains a model using fastText and saves it at output location.
        Finally it removes the temporary file.
        """
        self._write_training_data_to_file()
        self._pre_processing_file()
        self._train_tagging_model(output)
        self._remove_tempfile()

    def _write_training_data_to_file(self):
        f = NamedTemporaryFile(delete=False)

        # Fill the model with usenet base data if self.use_pre == True
        if self.use_pre:
            with open(
                    resources_path + "usenet_data_{}.txt".format(self.cat),
                    'r'
            ) as basef:
                for line in basef:
                    f.write(line)

        # Fetch new data from cassandra
        data = fetch_data()
        for message in data:
            content = message.get_body().replace("\n", " ")
            # TODO: add multi-language support: language=message.get_language()
            tokens = word_tokenize(content)
            f.write(labelling(message) + ' '.join(tokens) + "\n")

        self.tempfilename = f.name
        f.close()

    def _pre_processing_file(self):
        log.info('Training file is ready: ' + self.tempfilename)
        pass

    def _train_tagging_model(self, output):
        """Train a tagging model using an annotated file and save it to output.

        Pre-processing of the input file must have been done prior to training.
        Training file should be utf-8.
        The model is quantized to reduce memory usage.
        """
        log.info('Start training model.')
        new_model = fastText.train_supervised(input=self.tempfilename,
                                              epoch=self.epoch,
                                              lr=self.lr,
                                              wordNgrams=1,
                                              # self.wordNgrams,
                                              # minCount=self.minCount,
                                              dim=self.dim,
                                              loss=self.loss,
                                              thread=self.thread,
                                              neg=self.neg)
        log.info('Training model done.')
        log.info('Start quantization.')
        new_model.quantize(thread=self.thread)
        log.info('Quantization done.')
        new_model.save_model(resources_path + "models/" + output)
        log.info(
            'Model saved at {}.'.format(resources_path + "models/" + output)
        )

    def _remove_tempfile(self):
        os.remove(self.tempfilename)
