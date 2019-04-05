import { v4 as uuidv4 } from 'uuid';

/* eslint-disable camelcase */
export class Message {
  constructor(props = {}) {
    Object.assign(this, props);
  }

  message_id = uuidv4()

  discussion_id

  subject = ''

  body = ''

  parent_id

  user_identities
}
