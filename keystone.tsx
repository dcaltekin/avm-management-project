import { config, list } from '@keystone-6/core';
import { text, relationship, integer, timestamp, password, select } from '@keystone-6/core/fields';
import { statelessSessions } from '@keystone-6/core/session';
import { createAuth } from '@keystone-6/auth';
import dotenv from 'dotenv';

dotenv.config();

const db = {
  provider: 'mysql' as 'mysql',
  url: process.env.DB_HOST as string,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  sessionData: 'id role',
});

const session = statelessSessions({
  secret: process.env.SESSION_SECRET as string,
  maxAge: 60 * 60 * 24 * 30,
});

const allowAllOperations = {
  operation: {
    query: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
};

const lists = {
  Payment: list({
    fields: {
      store: relationship({ ref: 'Store.payments' }),
      amount: integer(),
      payment_date: timestamp(),
      created_at: timestamp({ defaultValue: { kind: 'now' } }),
    },
    access: allowAllOperations,
  }),
  Mall: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      location: text(),
      created_at: timestamp({ defaultValue: { kind: 'now' } }),
      stores: relationship({ ref: 'Store.malls', many: true }),
    },
    access: allowAllOperations,
  }),
  Store: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      malls: relationship({ ref: 'Mall.stores', many: true }), 
      client: relationship({ ref: 'Client' }),
      created_at: timestamp({ defaultValue: { kind: 'now' } }),
      payments: relationship({ ref: 'Payment.store', many: true }),
    },
    access: allowAllOperations,
  }),
  Client: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      contact: text(),
      email: text({ validation: { isRequired: true } }),
      created_at: timestamp({ defaultValue: { kind: 'now' } }),
    },
    access: allowAllOperations,
  }),
  User: list({
    fields: {
      username: text({ validation: { isRequired: true } }),
      password: password(),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      role: select({
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ],
        defaultValue: 'user',
        validation: { isRequired: true },
      }),
    },
    access: allowAllOperations,
  }),
};

export default withAuth(
  config({
    db,
    lists,
    session,
  })
);
