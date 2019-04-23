Caliopen Tagger package
=======================

This package contains all logic related to the tagger in Caliopen platform.

The tagger uses `FastText`_ for both taggers and models_manager packages.

The FastText classifier is an implementation of the `Bag of Tricks for Efficient Text Classification`_ (2016) paper.

It is used to train a tagging model, and to predict tags (with their confidence score) on new messages.

Training a FastText model
-------------------------

The training file is a simple .txt format as follows: ::

    __label__tag1 this is a sentence labelled as tag1
    __label__tag2 this is a sentence labelled as tag2
    __label__tag1 __label__tag2 this is a sentence labelled as both tag1 and tag2


The list of hyper-parameters available to train a model can be found `here`_, as well as a tutorial `there`_.

The most important parameters (the ones having a bigger impact) to train a FastText model are listed hereunder.
A recommended value is suggested for each based on previous Cross-Validation experimentation on Usenet data.

- lr: The learning rate parameter.
  The higher the learning rate, the faster the model will converge.
  On the other hand, if the learning rate is too high, the training might overshoot the loss minimum.
  Based on our experiments, we recommend using a value around 0.1.
- epoch: The number of epochs to train the model.
  The more epochs there are, the longer the training.
  A value between 5 and 25 appears to give good results.
- loss: The loss function to use. It is the function that we will want to minimize.
  In our experiments, we found softmax to give the best results.
- neg: The number of negative samples to use.
  In our experiments, the default value of 5 gave the best results.
- thread: The number of threads to use for the training.
  The bigger the number of threads, the faster the training.
- dim: The dimension of the embeddings, i.e. the size of the word vectors.
  The bigger the value, the bigger the model.
  A size varying between 100 and 300 are standards.
- pretrainedVectors: A model of pretrained vectors.
  It is possible to train pretrainedVectors on a larger non-annotated corpus,
  and then to use it as our embeddings while training.
  The quality of pretrainedVectors can have a great impact on the training.
  See `FastText Word Representations`_ to train your own vectors.
- wordNgrams: The max length of ngrams to consider.
  If wordNgrams is set to 2, the model will use bigrams.
  In our experiments, we observed that 2 was the best option.
  It gives better results than 1, while using wordNgrams=3 doesn't improve the results.


Predicting with a FastText model
--------------------------------

Once we have a FastText model, it is possible to predict tags.
Each predicted tag will have a confidence score associated, ranging from 0 to 1.

The only parameters are the following ones.

- k: The maximum number of tags to return.
- threshold: The threshold value to apply on the predicted tags.
  If its confidence is lower than the threshold, the tag won't be return.

Even if k is set to a value, due to the threshold parameter, the model might output fewer predictions.

.. _FastText: https://fasttext.cc/
.. _Bag of Tricks for Efficient Text Classification: https://arxiv.org/abs/1607.01759
.. _FastText Word Representations: https://fasttext.cc/docs/en/unsupervised-tutorial.html
.. _here: https://fasttext.cc/docs/en/options.html
.. _there: https://fasttext.cc/docs/en/supervised-tutorial.html
