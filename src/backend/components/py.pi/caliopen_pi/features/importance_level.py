# -*- coding: utf-8 -*-
"""Compute Caliopen message importance level."""

from __future__ import absolute_import, print_function, unicode_literals

import logging

log = logging.getLogger(__name__)

# Importance level is between MIN_VALUE and MAX_VALUE (inclusives)
MIN_VALUE = -10
MAX_VALUE = 10
MAX_TAG_SCORE = 10  # Max importance level that can be set for a tag

SPAM_RATIO = 0.5
# Le PI contexte du message compte pour 1/8 des points positifs
PI_CX_RATIO = 1.0 / 8.0
# le PI comportement du message compte à lui seul pour 1/4 des points positifs
PI_CO_RATIO = 1.0 / 4.0
# Les éléments contextuels (tags associés, association du type de terminal
# au protocole utilisé, horaire, langue...) comptent pour 1/8 des points
# positifs.
CONTEXT_RATIO = 1.0 / 8.0

REPLY_VALUE = 2.0


def get_importance_tags(tags):
    """Get the max importance level from tags."""
    max_value = 0
    for tag in tags:
        if getattr(tag, 'importance_level'):
            if tag.importance_level > max_value:
                max_value = tag.importance_level
    return max_value


def compute_inbound(user, message, features, participants):
    """Compute importance level for an inbound message."""
    positive = 0
    negative = 0
    scores = []
    # Spam level
    if features.get('is_spam'):
        spam_score = features.get('spam_score', 0) / 100.0
        negative -= spam_score * abs(MIN_VALUE * SPAM_RATIO)
        scores.append(('spam_score', spam_score))
    # PI message
    if message.pi.context:
        context_score = message.pi.context / 100.0
        positive += context_score * PI_CX_RATIO * MAX_VALUE
        scores.append(('context_score', context_score))
    if message.pi.comportment:
        comportment_score = message.pi.comportment / 100.0
        positive += comportment_score * PI_CO_RATIO * MAX_VALUE
        scores.append(('comportment_score', comportment_score))
    # Tags
    if message.tags:
        tag_score = get_importance_tags(message.tags)
        positive += tag_score / MAX_TAG_SCORE * CONTEXT_RATIO
        scores.append(('tag_score', tag_score))

    # It's a reply ?
    if message.external_references:
        # XXX find if we know related messages to increment level
        positive += REPLY_VALUE
        scores.append(('reply_score', REPLY_VALUE))

    log.info('Importance scores: {0}'.format(scores))
    # Return the final value
    if negative:
        return round(max(MIN_VALUE, negative))
    return round(min(MAX_VALUE, positive))
