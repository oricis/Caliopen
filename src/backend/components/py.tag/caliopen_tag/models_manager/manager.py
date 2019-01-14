# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging
import os
from tempfile import NamedTemporaryFile
from .data_manager import UsenetDataManager, ESDataManager
from caliopen_storage.config import Configuration
from ..utils import resources_path

import fastText

log = logging.getLogger(__name__)
usenet_file = "usenet_data_{}.txt"


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
            min_count=400,
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
        self._train_tagging_model(output)
        self._remove_tempfile()

    def _write_usenet_data(self, f):
        usenet_manager = UsenetDataManager({})
        usenet_manager.prepare(
            resources_path + usenet_file.format(self.cat)
        )

        count = 0
        for item in usenet_manager.next():
            f.write(item.encode("utf-8") + "\n".encode("utf-8"))
            count += 1
        return count

    @staticmethod
    def _write_elastic_data(f):

        config = Configuration('global').configuration
        es_manager = ESDataManager(config)
        query = es_manager.get_query()

        es_manager.prepare(query, index=None, doc_type='indexed_message')

        count = 0
        for item in es_manager.next():
            f.write(item.encode("utf-8") + "\n".encode("utf-8"))
            count += 1
        return count

    def _write_training_data_to_file(self):
        f = NamedTemporaryFile(delete=False, dir=resources_path)

        # Fill the model with usenet base data if self.use_pre == True
        if self.use_pre:
            count_usenet = self._write_usenet_data(f)
            log.info('Wrote ' + str(count_usenet) + " lines from usenet data.")

        count_es = self._write_elastic_data(f)
        log.info('Wrote ' + str(count_es) + " lines from elastic data.")

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
        new_model.save_model(resources_path + "models/" + output + ".bin")
        log.info(
            'Model saved at {}.'.format(resources_path + "models/" + output)
        )

    def _remove_tempfile(self):
        os.remove(self.tempfilename)
