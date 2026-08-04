import z from 'zod';

export const ApiResponseSchema = z.object({
  status: z.number(),
  code: z.string(),
  message: z.string(),
  data: z.unknown(),
});

export type ApiResponseEnvelope = z.infer<typeof ApiResponseSchema>;

export const TokenRefreshResponseSchema = ApiResponseSchema.extend({
  data: z.object({ accessToken: z.string() }).optional(),
});

export type TokenRefreshResponse = z.infer<typeof TokenRefreshResponseSchema>;
