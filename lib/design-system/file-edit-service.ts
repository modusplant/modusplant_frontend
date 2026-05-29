import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  designSystemFileEditAllowedPaths,
  designSystemFileEditRequestSchema,
  type DesignSystemFileEdit,
  type DesignSystemFileEditCapabilities,
  type DesignSystemFileEditMode,
  type DesignSystemFileEditResponse,
  type DesignSystemFileEditResult,
} from '@/lib/design-system/file-edit-contract';

const MAX_FILE_BYTES = 300_000;

type PreparedEdit = DesignSystemFileEditResult & {
  absolutePath: string;
  nextContent?: string;
};

function hashContent(content: string) {
  return createHash('sha256').update(content).digest('hex').slice(0, 12);
}

function normalizeRelativePath(inputPath: string) {
  const normalized = inputPath.replaceAll('\\', '/').replace(/^\/+/, '');

  if (path.isAbsolute(inputPath) || normalized.startsWith('../')) {
    throw new Error('Only project-relative paths are allowed.');
  }

  const root = process.cwd();
  const absolutePath = path.resolve(root, normalized);
  const relativePath = path.relative(root, absolutePath).replaceAll('\\', '/');

  if (
    relativePath.startsWith('../') ||
    path.isAbsolute(relativePath) ||
    relativePath.length === 0
  ) {
    throw new Error('Path escapes the project root.');
  }

  return { absolutePath, relativePath };
}

function isAllowedPath(relativePath: string) {
  if (
    relativePath === 'app/globals.css' ||
    relativePath === 'app/design-system/page.tsx'
  ) {
    return true;
  }

  if (
    relativePath.startsWith('docs/design-system/') &&
    relativePath.endsWith('.md')
  ) {
    return true;
  }

  if (
    relativePath.startsWith('components/_common/') &&
    relativePath.endsWith('.tsx')
  ) {
    return true;
  }

  return (
    relativePath.startsWith('stories/components/') &&
    relativePath.endsWith('.stories.tsx')
  );
}

function canUseLocalFileBackend() {
  return process.env.NODE_ENV !== 'production';
}

function countOccurrences(source: string, find: string) {
  return source.split(find).length - 1;
}

async function readExistingFile(absolutePath: string) {
  const content = await readFile(absolutePath, 'utf8');
  const bytes = Buffer.byteLength(content, 'utf8');

  if (bytes > MAX_FILE_BYTES) {
    throw new Error(
      `File is too large for design-system edits: ${bytes} bytes.`
    );
  }

  return { content, bytes };
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error;
}

async function prepareReplaceTextEdit(
  edit: Extract<DesignSystemFileEdit, { type: 'replaceText' }>,
  mode: DesignSystemFileEditMode
): Promise<PreparedEdit> {
  const { absolutePath, relativePath } = normalizeRelativePath(edit.path);

  if (!isAllowedPath(relativePath)) {
    throw new Error(`Path is not allowlisted: ${relativePath}`);
  }

  const before = await readExistingFile(absolutePath);
  const occurrences = countOccurrences(before.content, edit.find);

  if (occurrences === 0) {
    throw new Error(`Text to replace was not found in ${relativePath}.`);
  }

  if (
    edit.expectedOccurrences !== undefined &&
    occurrences !== edit.expectedOccurrences
  ) {
    throw new Error(
      `Expected ${edit.expectedOccurrences} occurrence(s), found ${occurrences}.`
    );
  }

  const nextContent = before.content.split(edit.find).join(edit.replace);
  const changed = nextContent !== before.content;

  return {
    absolutePath,
    path: relativePath,
    type: edit.type,
    status: changed ? (mode === 'apply' ? 'applied' : 'dryRun') : 'unchanged',
    changed,
    occurrences,
    beforeHash: hashContent(before.content),
    afterHash: hashContent(nextContent),
    beforeBytes: before.bytes,
    afterBytes: Buffer.byteLength(nextContent, 'utf8'),
    nextContent,
  };
}

async function prepareWriteFileEdit(
  edit: Extract<DesignSystemFileEdit, { type: 'writeFile' }>,
  mode: DesignSystemFileEditMode
): Promise<PreparedEdit> {
  const { absolutePath, relativePath } = normalizeRelativePath(edit.path);

  if (!isAllowedPath(relativePath)) {
    throw new Error(`Path is not allowlisted: ${relativePath}`);
  }

  let beforeContent = '';
  let beforeBytes = 0;

  try {
    const before = await readExistingFile(absolutePath);
    beforeContent = before.content;
    beforeBytes = before.bytes;
  } catch (error) {
    if (!isNodeError(error) || error.code !== 'ENOENT') {
      throw error;
    }

    if (!edit.create) {
      throw error;
    }
  }

  const changed = beforeContent !== edit.content;

  return {
    absolutePath,
    path: relativePath,
    type: edit.type,
    status: changed ? (mode === 'apply' ? 'applied' : 'dryRun') : 'unchanged',
    changed,
    beforeHash: beforeContent ? hashContent(beforeContent) : undefined,
    afterHash: hashContent(edit.content),
    beforeBytes,
    afterBytes: Buffer.byteLength(edit.content, 'utf8'),
    nextContent: edit.content,
  };
}

function toErrorResult(edit: DesignSystemFileEdit, message: string) {
  return {
    path: edit.path,
    type: edit.type,
    status: 'error',
    changed: false,
    message,
  } satisfies DesignSystemFileEditResult;
}

function toPublicResult(edit: PreparedEdit): DesignSystemFileEditResult {
  return {
    path: edit.path,
    type: edit.type,
    status: edit.status,
    changed: edit.changed,
    occurrences: edit.occurrences,
    beforeHash: edit.beforeHash,
    afterHash: edit.afterHash,
    beforeBytes: edit.beforeBytes,
    afterBytes: edit.afterBytes,
    message: edit.message,
  };
}

export function getDesignSystemFileEditCapabilities(): DesignSystemFileEditCapabilities {
  if (process.env.DESIGN_SYSTEM_FILE_EDIT_ENDPOINT) {
    return {
      backend: 'remote',
      defaultMode: 'dryRun',
      canApply: true,
      allowedPaths: designSystemFileEditAllowedPaths,
      endpoint: '/api/design-system/file-edits',
    };
  }

  const canApply = canUseLocalFileBackend();

  return {
    backend: canApply ? 'local-fs' : 'disabled',
    defaultMode: 'dryRun',
    canApply,
    allowedPaths: designSystemFileEditAllowedPaths,
    endpoint: '/api/design-system/file-edits',
  };
}

export async function applyDesignSystemFileEdit(
  input: unknown
): Promise<DesignSystemFileEditResponse> {
  const parsed = designSystemFileEditRequestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      backend: getDesignSystemFileEditCapabilities().backend,
      mode: 'dryRun',
      applied: false,
      results: [],
      message: parsed.error.issues.map((issue) => issue.message).join(', '),
    };
  }

  const request = parsed.data;
  const capabilities = getDesignSystemFileEditCapabilities();

  if (request.mode === 'apply' && !capabilities.canApply) {
    return {
      ok: false,
      backend: capabilities.backend,
      mode: request.mode,
      applied: false,
      results: request.edits.map((edit) =>
        toErrorResult(edit, 'File edits are disabled in this environment.')
      ),
      message: 'File edits are disabled in this environment.',
    };
  }

  const preparedEdits: PreparedEdit[] = [];
  const errors: DesignSystemFileEditResult[] = [];

  for (const edit of request.edits) {
    try {
      const prepared =
        edit.type === 'replaceText'
          ? await prepareReplaceTextEdit(edit, request.mode)
          : await prepareWriteFileEdit(edit, request.mode);

      preparedEdits.push(prepared);
    } catch (error) {
      errors.push(
        toErrorResult(
          edit,
          error instanceof Error ? error.message : 'Unknown file edit error.'
        )
      );
    }
  }

  if (errors.length > 0) {
    return {
      ok: false,
      backend: capabilities.backend,
      mode: request.mode,
      applied: false,
      results: [...preparedEdits.map(toPublicResult), ...errors],
      message: 'One or more edits failed validation. No files were changed.',
    };
  }

  if (request.mode === 'apply') {
    for (const edit of preparedEdits) {
      if (edit.changed && edit.nextContent !== undefined) {
        await mkdir(path.dirname(edit.absolutePath), { recursive: true });
        await writeFile(edit.absolutePath, edit.nextContent, 'utf8');
      }
    }
  }

  return {
    ok: true,
    backend: capabilities.backend,
    mode: request.mode,
    applied:
      request.mode === 'apply' && preparedEdits.some((edit) => edit.changed),
    results: preparedEdits.map(toPublicResult),
  };
}
