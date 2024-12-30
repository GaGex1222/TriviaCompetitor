import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  username: text('username').notNull(),
  points: integer('points').default(0),
  profileUrl: text('profile_url').notNull(),
  createdAt: text('created_at')
});
export const triviasTable = sqliteTable('trivias', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  creatorId: text('creator_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`),

});

export const questionsTable = sqliteTable("questions", {
    id: integer('id').primaryKey(),
    title: text("title").notNull(),
    imageUrl: text("image_url").notNull(),
    triviaId: integer("trivia_id")
    .notNull()
    .references(() => triviasTable.id, {onDelete: "cascade"}),
})

export const questionOptionsTable =sqliteTable("question_options", {
    id: integer('id').primaryKey(),
    questionOptionTitle: text("question_option_title").notNull(),
    correctAnswer: integer('correct_answer' ,{mode: 'boolean'}).notNull(),
    questionId: integer("question_id")
    .notNull()
    .references(() => questionsTable.id, {onDelete: 'cascade'})
})

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertTrivia = typeof triviasTable.$inferInsert;
export type SelectTrivia = typeof triviasTable.$inferSelect;
export type InsertQuestion = typeof questionsTable.$inferInsert;
export type SelectQuestion = typeof questionsTable.$inferSelect;
export type InsertQuestionOption = typeof questionOptionsTable.$inferInsert;
export type SelectQuestionOption = typeof questionOptionsTable.$inferSelect;
