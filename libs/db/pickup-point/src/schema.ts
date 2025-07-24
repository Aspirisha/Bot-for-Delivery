import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const uuidv7 = require('@kripod/uuidv7');

export const userRoleEnum = pgEnum('user_role', [
  'employee',
  'volunteer',
  'coordinator',
  'guest',
]);
export const userGender = pgEnum('user_gender', ['male', 'female']);
export const userTable = pgTable(
  'users',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7.uuidv7()),
    tgId: bigint('tg_id', { mode: 'bigint' }).notNull(),
    tgUsername: varchar('tg_username', { length: 32 }),
    name: varchar('name', { length: 64 }).notNull(),
    phone: varchar('phone', { length: 32 }).notNull(),
    gender: userGender('gender').notNull(),
    role: userRoleEnum('role').default('guest').notNull(),
  },
  (table) => [uniqueIndex('uniqueTgId').on(table.tgId)]
);

export const shiftStatusEnum = pgEnum('shift_status', [
  'busy',
  'halfBusy',
  'free',
  'weekend',
]);
export const shiftTable = pgTable(
  'shift',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7.uuidv7()),
    dateStart: timestamp('date_start').notNull(),
    dateEnd: timestamp('date_end').notNull(),
    title: varchar('title', { length: 64 }).notNull(),
    status: shiftStatusEnum('status').default('free').notNull(),
  },
  (table) => [uniqueIndex('uniqueDate').on(table.dateStart, table.dateEnd)]
);

export const userShiftsTable = pgTable(
  'user_shifts_table',
  {
    userId: uuid('user_id')
      .references(() => userTable.id)
      .notNull(),
    shiftId: uuid('shift_id')
      .references(() => shiftTable.id)
      .notNull(),
    status: boolean('status'),
  },
  (t) => [
    primaryKey({
      columns: [t.userId, t.shiftId],
      name: 'user_shifts_pkey',
    }),
  ]
);

export const userShiftsRelations = relations(userShiftsTable, ({ one }) => ({
  shift: one(shiftTable, {
    fields: [userShiftsTable.shiftId],
    references: [shiftTable.id],
    relationName: 'shift_user',
  }),
  user: one(userTable, {
    fields: [userShiftsTable.userId],
    references: [userTable.id],
    relationName: 'user_shifts',
  }),
}));
