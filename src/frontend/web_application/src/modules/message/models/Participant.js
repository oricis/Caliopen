/* eslint-disable camelcase */
export class Participant {
  constructor(props = {}) {
    Object.assign(this, props);
  }

  address
  protocol
  label
  type = 'To'
  contact_ids = []
}
