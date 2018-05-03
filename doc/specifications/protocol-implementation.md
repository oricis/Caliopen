Protocol implementation
=======================

**FIXME:** out of date

**Important note:**

> The following document has been imported as is from the previous client in angularJs; the file structure has changed and this part of the program is not implemeted.

---

The purpose of this document is list tasks to do in order to support new protocol.

This procedure may evolve following API evolutions.

## Client

### Message creation: Available protocols

Add the protocol to the list in `module/recipient-list` component:

```
const PROTOCOLS = {
  // ...
  sms: {
    iconClass: 'fa-mobile',
  },
  email: {
    iconClass: 'fa-envelope',
    regexp: /^\w+@\w+(\.\w+)?$/,
  },
  // ...
};
```

The `iconClass` property is required and the stylesheet class must be available (cf. font-awesome or whatever). The `regexp` is optional but recommended in order to automatically detect the protocol.

## Annexes

### Actors

A recipient is the target of a message and can be known or not.

When a contact is attached to a recipient, the user can select a protocol known for the contact and available for the caliopen's instance. When the user write himself an address (or a number) an available protocol is detected. Eventually the user can change it afterward.
