import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { CATEGORY_ERROR_CODES } from '../constants/category-error-codes.constant';
import type { CategoryRecord } from '../models/category.model';
import * as auditLogServiceModule from '../../../audit/services/audit-log.service';
import * as categoryRepositoryModule from '../repositories/category.repository';
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
} from './category.service';

type CategoryRepositoryModule = {
  findCategoryById: (categoryId: string) => Promise<(CategoryRecord & { _id: Types.ObjectId }) | null>;
  findCategoryBySlug: (
    slug: string,
    excludeId?: string,
  ) => Promise<(CategoryRecord & { _id: Types.ObjectId }) | null>;
  createCategory: (
    payload: Partial<CategoryRecord>,
  ) => Promise<CategoryRecord & { _id: Types.ObjectId }>;
  updateCategoryById: (
    categoryId: string,
    payload: Partial<CategoryRecord>,
  ) => Promise<(CategoryRecord & { _id: Types.ObjectId }) | null>;
  softDeleteCategoryById: (
    categoryId: string,
    updatedBy: Types.ObjectId | null,
  ) => Promise<(CategoryRecord & { _id: Types.ObjectId }) | null>;
  countChildCategories: (parentCategoryId: string) => Promise<number>;
};

const categoryRepository = categoryRepositoryModule as unknown as CategoryRepositoryModule;
const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};
const noopAuditLog = async () => undefined;

const originalRepository: CategoryRepositoryModule = {
  findCategoryById: categoryRepository.findCategoryById,
  findCategoryBySlug: categoryRepository.findCategoryBySlug,
  createCategory: categoryRepository.createCategory,
  updateCategoryById: categoryRepository.updateCategoryById,
  softDeleteCategoryById: categoryRepository.softDeleteCategoryById,
  countChildCategories: categoryRepository.countChildCategories,
};

const categoryId = new Types.ObjectId();
const parentId = new Types.ObjectId();
const actorId = new Types.ObjectId().toString();

const buildCategory = (
  overrides: Partial<CategoryRecord & { _id: Types.ObjectId }> = {},
): CategoryRecord & { _id: Types.ObjectId } => ({
  _id: categoryId,
  name: 'Groceries',
  slug: 'groceries',
  description: null,
  parentCategoryId: null,
  level: 1,
  displayOrder: 0,
  iconUrl: null,
  bannerUrl: null,
  isFeatured: false,
  isVisible: true,
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});

const isAppErrorWithCode = (error: unknown, code: string) => {
  return error instanceof AppError && error.errorCode === code;
};

beforeEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
});

afterEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
  categoryRepository.findCategoryById = originalRepository.findCategoryById;
  categoryRepository.findCategoryBySlug = originalRepository.findCategoryBySlug;
  categoryRepository.createCategory = originalRepository.createCategory;
  categoryRepository.updateCategoryById = originalRepository.updateCategoryById;
  categoryRepository.softDeleteCategoryById = originalRepository.softDeleteCategoryById;
  categoryRepository.countChildCategories = originalRepository.countChildCategories;
});

test('createCategory creates root category with generated slug', async () => {
  categoryRepository.findCategoryBySlug = async () => null;
  categoryRepository.createCategory = async (payload) =>
    buildCategory({
      ...payload,
      _id: categoryId,
    });

  const created = await createCategory(
    {
      name: 'Groceries',
    },
    actorId,
  );

  assert.equal(created.slug, 'groceries');
  assert.equal(created.level, 1);
});

test('createCategory rejects duplicate slug', async () => {
  categoryRepository.findCategoryBySlug = async () => buildCategory();

  await assert.rejects(
    () =>
      createCategory(
        {
          name: 'Groceries',
          slug: 'groceries',
        },
        actorId,
      ),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[CATEGORY_ERROR_CODES.CATEGORY_SLUG_ALREADY_EXISTS]),
  );
});

test('createCategory rejects invalid parent', async () => {
  categoryRepository.findCategoryById = async () => null;

  await assert.rejects(
    () =>
      createCategory(
        {
          name: 'Snacks',
          parentCategoryId: parentId.toString(),
        },
        actorId,
      ),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[CATEGORY_ERROR_CODES.INVALID_PARENT_CATEGORY]),
  );
});

test('getCategoryById returns not found for missing category', async () => {
  categoryRepository.findCategoryById = async () => null;

  await assert.rejects(
    () => getCategoryById(categoryId.toString()),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[CATEGORY_ERROR_CODES.CATEGORY_NOT_FOUND]),
  );
});

test('deleteCategory blocks delete when children exist', async () => {
  categoryRepository.findCategoryById = async () => buildCategory();
  categoryRepository.countChildCategories = async () => 2;

  await assert.rejects(
    () => deleteCategory(categoryId.toString(), actorId),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[CATEGORY_ERROR_CODES.CATEGORY_HAS_CHILDREN]),
  );
});

test('updateCategory updates fields', async () => {
  const existing = buildCategory();

  categoryRepository.findCategoryById = async () => existing;
  categoryRepository.findCategoryBySlug = async () => null;
  categoryRepository.updateCategoryById = async (_id, payload) =>
    buildCategory({
      ...existing,
      ...payload,
      name: 'Updated Groceries',
    });

  const updated = await updateCategory(
    categoryId.toString(),
    {
      name: 'Updated Groceries',
    },
    actorId,
  );

  assert.equal(updated.name, 'Updated Groceries');
});
