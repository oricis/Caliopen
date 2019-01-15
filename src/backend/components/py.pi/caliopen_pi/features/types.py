# -*- coding: utf-8 -*-
"""Caliopen privacy features definition."""

from __future__ import unicode_literals, absolute_import

import logging

# Privacy features definition
MESSAGE = {'mail_emitter_mx_reputation': {'type': 'string'},
           'mail_emitter_certificate': {'type': 'string'},
           'mail_agent': {'type': 'string'},
           'transport_signed': {'type': 'bool'},
           'message_signed': {'type': 'bool'},
           'message_signature_type': {'type': 'string'},
           'message_encrypted': {'type': 'bool'},
           'message_encryption_method': {'type': 'string'},
           'message_encryption_infos': {'type': 'string'},
           'is_spam': {'type': 'bool'},
           'spam_score': {'max': 100, 'min': 0, 'type': 'int'},
           'spam_method': {'type': 'string'},
           'ingress_socket_version': {'type': 'string'},
           'ingress_cipher': {'type': 'string'},
           'nb_external_hops': {'type': 'int'}}

DEVICE = {'browser_family': {'type': 'string'},
          'browser_version': {'type': 'string'},
          'os_family': {'type': 'string'},
          'device_type': {'type': 'string'},
          'detected_country': {'type': 'string'}}

CONTACT = {'message_day_total': {'type': 'int'},
           'message_day_avg': {'type': 'int'},
           'message_day_pstdev': {'type': 'int'},
           'address_or_phone': {'type': "bool"},
           'public_key_best_size': {'type': 'int'},
           'nb_protocols': {'type': 'int'}}

FEATURES = {}

for feature in (MESSAGE, DEVICE, CONTACT):
    FEATURES.update(feature)

log = logging.getLogger(__name__)


def check_feature_bounding(value, feature):
    """Check that a feature fit between min and max value if apply."""
    if 'min' in feature and value < feature['min']:
        return False
    if 'max' in feature and value > feature['max']:
        return False
    return True


def find_feature(name):
    """Find a feature by its name."""
    if name in FEATURES:
        return FEATURES[name]


def check_feature(name, value):
    """Check that a feature have a correct value."""

    feature = find_feature(name)
    if not feature:
        return False

    if feature['type'] == 'int':
        try:
            int(value)
        except ValueError:
            return False
        return check_feature_bounding(value, feature)

    elif feature['type'] == 'bool':
        return True if value in (True, False) else False
    elif feature['type'] == 'string':
        return True
    log.error('Invalid feature type %s, fail silently for the moment' %
              feature['type'])


def unmarshal_feature(name, value):
    """Unmarshal a feature to it's type representation."""
    if not check_feature(name, value):
        raise ValueError('Invalid value {} for feature {}'.format(value, name))
    feature = find_feature(name)
    if not feature:
        log.warn('Unknow feature %s' % name)
        return None
    if feature['type'] == 'int':
        return int(value)
    elif feature['type'] == 'bool':
        return True if value.lower().startswith('t') else False
    elif feature['type'] == 'string':
        return value


def unmarshal_features(features):
    """Unmarshal a dict of features for suitable output."""
    res = {}
    for name, value in features.items():
        try:
            new_value = unmarshal_feature(name, value)
            res[name] = new_value
        except ValueError:
            log.warn('Feature {} with {} do not marshall'.format(name, value))
            pass
    return res


def marshal_features(features):
    """Unmarshall a dict of features suitable for storage."""
    res = {}
    for k, v in features.items():
        if not (v == '' or v is None):
            res[k] = str(v)
    return res


def init_features(type_):
    """Initialize privacy features for a given object type."""
    if type_ == 'contact':
        features = CONTACT
    elif type_ == 'device':
        features = DEVICE
    elif type_ == 'message':
        features = MESSAGE
    else:
        raise ValueError('Invalid feature type %s' % type_)

    output = {}
    for k, v in features.items():
        if v['type'] == 'bool':
            value = False
        elif v['type'] == 'int':
            value = 0
        else:
            value = ''
        output.update({k: value})
    return output
