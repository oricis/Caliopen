# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import logging


from caliopen_main.objects.device import Device as ObjectDevice
from caliopen_main.user.core import Device as CoreDevice

from cornice.resource import resource, view

from ..base import Api
from ..base.context import DefaultContext


log = logging.getLogger(__name__)


@resource(collection_path='/devices',
          path='/devices/{device_id}',
          name='Device',
          factory=DefaultContext
          )
class DeviceAPI(Api):

    """Device management API."""

    def __init__(self, request, context):
        self.request = request
        self.user = request.authenticated_userid

    @view(renderer='json', permission='authenticated')
    def collection_post(self):
        """Create a new device for an user."""
        params = self.request.swagger_data['device']

        device = CoreDevice.create(self.user, name=params['name'],
                                   type=params['type'])
        device_url = self.request.route_path('Device',
                                             device_id=device.device_id)
        self.request.response.location = device_url.encode('utf-8')
        # XXX return a Location to get device not send it direct
        return {'location': device_url}

    @view(renderer='json', permission='authenticated')
    def collection_get(self):
        """Return list of user devices."""
        objects = ObjectDevice.list_db(self.user.user_id)
        devices = [x.marshall_dict() for x in objects]
        log.debug('Devices are : {}'.format(devices))
        return {'devices': devices, 'count': len(devices)}
