# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging
import os
from tempfile import NamedTemporaryFile
from ..utils import resources_path

import fastText

log = logging.getLogger(__name__)


class ModelManager(object):
    """
    Manage tagging model:
     - training a new model
    """

    def __init__(
            self,
            provider,
            use_pre=True,
            epoch=15,
            lr=0.1,
            word_n_grams=2,
            min_count=400,
            dim=100,
            loss="softmax",
            thread=12,
            neg=5):
        """Initialize a model manager.

        It requires a provider to iterate on for creating the data.
        All hyperparameters for training the model are optional.
        """
        self.provider = provider
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
        result_file = self._train_tagging_model(output)
        self._remove_tempfile()
        return result_file

    def _write_training_data_to_file(self):
        f = NamedTemporaryFile(delete=False, dir=resources_path)

        count_lines = 0

        for item in self.provider.next():
            f.write(item.encode("utf-8") + "\n".encode("utf-8"))
            count_lines += 1

        log.info('Wrote ' + str(count_lines) + " lines from elastic data.")

        self.tempfilename = f.name
        f.close()

    def _train_tagging_model(self, output, quantization=False):
        """Train a tagging model using an annotated file and save it to output.

        Pre-processing of the input file must have been done prior to training.
        Training file should be utf-8.
        The model can be quantized to reduce memory usage
        (but quantization is quite expensive).
        """
        log.info('Start training model.')
        new_model = fastText.train_supervised(input=self.tempfilename,
                                              epoch=self.epoch,
                                              lr=self.lr,
                                              wordNgrams=self.wordNgrams,
                                              minCount=self.minCount,
                                              dim=self.dim,
                                              loss=self.loss,
                                              thread=self.thread,
                                              neg=self.neg)
        log.info('Training model done.')
        if quantization:
            log.info('Start quantization.')
            new_model.quantize(thread=self.thread, retrain=False)
            log.info('Quantization done.')
        model_file = '{}/{}.bin'.format(resources_path, output)
        new_model.save_model(model_file)
        log.info('Model saved at {}.'.format(model_file))
        return model_file

    def _remove_tempfile(self):
        os.remove(self.tempfilename)
