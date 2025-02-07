import { Operator } from 'src/enum/operator.enum';
import { z } from 'zod';

export const createBookSchema = z.array(
  z.object({
    title: z.string(),
    genre: z.string(),
    price: z.number(),
    author: z.string(),
    publicationYear: z.string(),
    remaining: z.number().gte(0).optional(),
  }),
);
export type CreateBookDto = z.infer<typeof createBookSchema>;

export const updateBookSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  genre: z.string().optional(),
  price: z.number().gte(0).optional(),
  author: z.string().optional(),
  publicationYear: z.string().optional(),
  remaining: z.number().gte(0).optional(),
});
export type UpdateBookDto = z.infer<typeof updateBookSchema>;

export const getBookSchema = z.object({
  id: z.number().optional(),
  title: z
    .object({
      value: z.string(),
      operator: z.enum([Operator.Exact, Operator.Partial]),
    })
    .optional(),
  genre: z
    .object({
      value: z.string(),
      operator: z.enum([Operator.Exact, Operator.Partial]),
    })
    .optional(),
  author: z
    .object({
      value: z.string(),
      operator: z.enum([Operator.Exact, Operator.Partial]),
    })
    .optional(),
  price: z
    .object({
      value: z.string(),
      operator: z.enum([
        Operator.Exact,
        Operator.Lte,
        Operator.Gte,
        Operator.Range,
      ]),
    })
    .optional(),
  publicationYear: z
    .object({
      value: z.string(),
      operator: z.enum([
        Operator.Exact,
        Operator.Lte,
        Operator.Gte,
        Operator.Range,
      ]),
    })
    .optional(),
  remaining: z
    .object({
      value: z.string(),
      operator: z.enum([
        Operator.Exact,
        Operator.Lte,
        Operator.Gte,
        Operator.Range,
      ]),
    })
    .optional(),
});
export type GetBookDto = z.infer<typeof getBookSchema>;

export const deleteBookSchema = z.object({
  id: z.number().optional(),
  title: z
    .object({
      value: z.string(),
      operator: z.enum([Operator.Exact, Operator.Partial]),
    })
    .optional(),
  genre: z
    .object({
      value: z.string(),
      operator: z.enum([Operator.Exact, Operator.Partial]),
    })
    .optional(),
  author: z
    .object({
      value: z.string(),
      operator: z.enum([Operator.Exact, Operator.Partial]),
    })
    .optional(),
  price: z
    .object({
      value: z.string(),
      operator: z.enum([
        Operator.Exact,
        Operator.Lte,
        Operator.Gte,
        Operator.Range,
      ]),
    })
    .optional(),
  publicationYear: z
    .object({
      value: z.string(),
      operator: z.enum([
        Operator.Exact,
        Operator.Lte,
        Operator.Gte,
        Operator.Range,
      ]),
    })
    .optional(),
  remaining: z
    .object({
      value: z.string(),
      operator: z.enum([
        Operator.Exact,
        Operator.Lte,
        Operator.Gte,
        Operator.Range,
      ]),
    })
    .optional(),
});
export type DeleteBookDto = z.infer<typeof deleteBookSchema>;
