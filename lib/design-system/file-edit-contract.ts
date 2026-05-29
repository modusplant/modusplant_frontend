import { z } from 'zod';

export const designSystemFileEditAllowedPaths = [
  'docs/design-system/**/*.md',
  'app/globals.css',
  'app/design-system/page.tsx',
  'components/_common/**/*.tsx',
  'stories/components/**/*.stories.tsx',
] as const;

export const designSystemFileEditModeSchema = z
  .enum(['dryRun', 'apply'])
  .default('dryRun');

const relativeFilePathSchema = z
  .string()
  .min(1)
  .max(240)
  .refine((value) => !value.includes('\0'), {
    message: 'Path cannot include null bytes.',
  });

const replaceTextEditSchema = z.object({
  type: z.literal('replaceText'),
  path: relativeFilePathSchema,
  find: z.string().min(1),
  replace: z.string(),
  expectedOccurrences: z.number().int().positive().max(50).optional(),
});

const writeFileEditSchema = z.object({
  type: z.literal('writeFile'),
  path: relativeFilePathSchema,
  content: z.string().max(250_000),
  create: z.boolean().default(false),
});

export const designSystemFileEditSchema = z.discriminatedUnion('type', [
  replaceTextEditSchema,
  writeFileEditSchema,
]);

export const designSystemFileEditRequestSchema = z.object({
  mode: designSystemFileEditModeSchema,
  source: z.string().max(80).optional(),
  reason: z.string().max(1000).optional(),
  edits: z.array(designSystemFileEditSchema).min(1).max(20),
});

export type DesignSystemFileEditMode = z.infer<
  typeof designSystemFileEditModeSchema
>;

export type DesignSystemFileEdit = z.infer<typeof designSystemFileEditSchema>;

export type DesignSystemFileEditRequest = z.infer<
  typeof designSystemFileEditRequestSchema
>;

export type DesignSystemFileEditResult = {
  path: string;
  type: DesignSystemFileEdit['type'];
  status: 'applied' | 'dryRun' | 'unchanged' | 'error';
  changed: boolean;
  occurrences?: number;
  beforeHash?: string;
  afterHash?: string;
  beforeBytes?: number;
  afterBytes?: number;
  message?: string;
};

export type DesignSystemFileEditCapabilities = {
  backend: 'local-fs' | 'remote' | 'disabled';
  defaultMode: DesignSystemFileEditMode;
  canApply: boolean;
  allowedPaths: readonly string[];
  endpoint: string;
};

export type DesignSystemFileEditResponse = {
  ok: boolean;
  backend: DesignSystemFileEditCapabilities['backend'];
  mode: DesignSystemFileEditMode;
  applied: boolean;
  results: DesignSystemFileEditResult[];
  message?: string;
};
