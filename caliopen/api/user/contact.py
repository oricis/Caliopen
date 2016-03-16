
import json
import colander
from cornice.resource import resource, view
from pyramid.response import Response
import logging

from caliopen.base.user.core import (Contact as CoreContact,
                                     Email as CoreEmail,
                                     IM as CoreIM,
                                     Phone as CorePhone,
                                     SocialIdentity as CoreIdentity,
                                     PublicKey as CorePublicKey,
                                     Organization as CoreOrganization,
                                     PostalAddress as CoreAddress)

from caliopen.base.user.returns import (ReturnContact,
                                        ReturnIndexShortContact,
                                        ReturnAddress, ReturnEmail,
                                        ReturnIM, ReturnPhone,
                                        ReturnOrganization,
                                        ReturnSocialIdentity,
                                        ReturnPublicKey)

from caliopen.base.user.parameters import (NewContact,
                                           Contact as ContactParam,
                                           NewPostalAddress,
                                           NewEmail, NewIM)

from caliopen.api.base import Api
from caliopen.base.exception import NotFound
from caliopen.api.base.exception import ResourceNotFound, ValidationError

log = logging.getLogger(__name__)


@resource(collection_path='/contacts',
          path='/contacts/{contact_id}')
class Contact(Api):

    """Contact API."""

    def __init__(self, request):
        self.request = request
        self.user = request.authenticated_userid

    @view(renderer='json', permission='authenticated')
    def collection_get(self):
        results = CoreContact.find_index(self.user, None,
                                         limit=self.get_limit(),
                                         offset=self.get_offset())
        data = [ReturnIndexShortContact.build(x).serialize()
                for x in results['data']]
        return {'contacts': data, 'total': results['total']}

    @view(renderer='json', permission='authenticated')
    def get(self):
        contact_id = self.request.matchdict.get('contact_id')
        try:
            contact = CoreContact.get(self.user, contact_id)
        except NotFound:
            raise ResourceNotFound('No such contact')
        return {'contacts': ReturnContact.build(contact).serialize()}

    @view(renderer='json', permission='authenticated')
    def collection_post(self):
        """Create a new contact from json post data structure."""
        data = self.request.json
        contact_param = NewContact(data)
        try:
            contact_param.validate()
        except Exception as exc:
            raise ValidationError(exc)
        contact = CoreContact.create(self.user, contact_param)
        out_contact = ReturnContact.build(contact).serialize()
        return Response(status=201, body={'contacts': out_contact})


class BaseSubContactApi(Api):

    core_class = None
    return_class = None
    namespace = None

    def __init__(self, request):
        self.request = request
        self.user = request.authenticated_userid
        contact_id = self.request.matchdict.get('contact_id')
        self.contact = CoreContact.get(self.user, contact_id)

    @view(renderer='json', permission='authenticated')
    def collection_get(self):
        # XXX define filters from request
        filters = {}
        objs = self.core_class.find_index(self.user, self.contact, filters,
                                          limit=self.get_limit(),
                                          offset=self.get_offset())
        rets = [self.return_class.build(x).serialize() for x in objs['data']]
        return {self.namespace: rets, 'total': objs['total']}

    def _create(self, contact_id, params, add_func, return_obj):
        """Create sub object from param using add_func."""
        contact = CoreContact.get(self.user, contact_id)
        created = getattr(contact, add_func)(params)
        log.debug('Created object {} for contact {}'.
                  format(created.address_id, contact.contact_id))
        return return_obj.build(created).serialize()


class NewAddressParam(colander.MappingSchema):

    """Parameter to create a new postal address."""
    contact_id = colander.SchemaNode(colander.String(), location='path')
    label = colander.SchemaNode(colander.String(), location='body',
                                missing=colander.drop)
    type = colander.SchemaNode(colander.String(), location='body')
    street = colander.SchemaNode(colander.String(), location='body')
    city = colander.SchemaNode(colander.String(), location='body')
    postal_code = colander.SchemaNode(colander.String(), location='body')
    country = colander.SchemaNode(colander.String(), location='body')
    region = colander.SchemaNode(colander.String(), location='body',
                                 missing=colander.drop)


@resource(collection_path='/contacts/{contact_id}/addresses',
          path='/contacts/{contact_id}/addresses/{address_id}')
class ContactAddress(BaseSubContactApi):

    core_class = CoreAddress
    return_class = ReturnAddress
    namespace = 'addresses'

    @view(renderer='json', permission='authenticated',
          schema=NewAddressParam)
    def collection_post(self):
        validated = self.request.validated
        contact_id = validated.pop('contact_id')
        address = NewPostalAddress(validated)
        out_obj = self._create(contact_id, address, 'add_address',
                               ReturnAddress)
        return Response(status=201, body=json.dumps({'addresses': out_obj}))


class NewEmailParam(colander.MappingSchema):

    """Parameter to create a new email."""
    contact_id = colander.SchemaNode(colander.String(), location='path')
    type = colander.SchemaNode(colander.String(), location='body')
    address = colander.SchemaNode(colander.String(), location='body')


@resource(collection_path='/contacts/{contact_id}/emails',
          path='/contacts/{contact_id}/emails/{email_id}')
class ContactEmail(BaseSubContactApi):

    core_class = CoreEmail
    return_class = ReturnEmail
    namespace = 'emails'

    @view(renderer='json', permission='authenticated',
          schema=NewEmailParam)
    def collection_post(self):
        validated = self.request.validated
        contact_id = validated.pop('contact_id')
        email = NewEmail(validated)
        out_obj = self._create(contact_id, email, 'add_email',
                               ReturnEmail)
        return Response(status=201, body=json.dumps({'addresses': out_obj}))


class NewIMParam(colander.MappingSchema):

    """Parameter to create a new email."""
    contact_id = colander.SchemaNode(colander.String(), location='path')
    type = colander.SchemaNode(colander.String(), location='body')
    address = colander.SchemaNode(colander.String(), location='body')


@resource(collection_path='/contacts/{contact_id}/ims',
          path='/contacts/{contact_id}/ims/{im_id}')
class ContactIM(BaseSubContactApi):

    core_class = CoreIM
    return_class = ReturnIM
    namespace = 'ims'

    @view(renderer='json', permission='authenticated',
          schema=NewIMParam)
    def collection_post(self):
        validated = self.request.validated
        contact_id = validated.pop('contact_id')
        im = NewIM(validated)
        out_obj = self._create(contact_id, im, 'add_im',
                               ReturnIM)
        return Response(status=201, body=json.dumps({'addresses': out_obj}))


@resource(collection_path='/contacts/{contact_id}/identities',
          path='/contacts/{contact_id}/identities/{identity_id}')
class ContactSocialIdentity(BaseSubContactApi):

    core_class = CoreIdentity
    return_class = ReturnSocialIdentity
    namespace = 'identities'


@resource(collection_path='/contacts/{contact_id}/phones',
          path='/contacts/{contact_id}/phones/{phone_id}')
class ContactPhone(BaseSubContactApi):

    core_class = CorePhone
    return_class = ReturnPhone
    namespace = 'phones'


@resource(collection_path='/contacts/{contact_id}/organizations',
          path='/contacts/{contact_id}/organizations/{org_id}')
class ContactOrganization(BaseSubContactApi):

    core_class = CoreOrganization
    return_class = ReturnOrganization
    namespace = 'organizations'


@resource(collection_path='/contacts/{contact_id}/keys',
          path='/contacts/{contact_id}/keys/{key_id}')
class ContactPublicKey(BaseSubContactApi):

    core_class = CorePublicKey
    return_class = ReturnPublicKey
    namespace = 'keys'
