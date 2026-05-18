import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { BRAND_ERROR_CODES } from '../constants/brand-error-codes.constant';
import type { BrandRecord } from '../models/brand.model';
import * as auditLogServiceModule from '../../../audit/services/audit-log.service';
import * as brandRepositoryModule from '../repositories/brand.repository';
import { createBrand, deleteBrand, getBrandById, updateBrand } from './brand.service';

type BrandRepositoryModule = {
  findBrandById: (brandId: string) => Promise<(BrandRecord & { _id: Types.ObjectId }) | null>;
  findBrandBySlug: (
    slug: string,
    excludeId?: string,
  ) => Promise<(BrandRecord & { _id: Types.ObjectId }) | null>;
  createBrand: (payload: Partial<BrandRecord>) => Promise<BrandRecord & { _id: Types.ObjectId }>;
  updateBrandById: (
    brandId: string,
    payload: Partial<BrandRecord>,
  ) => Promise<(BrandRecord & { _id: Types.ObjectId }) | null>;
  softDeleteBrandById: (
    brandId: string,
    updatedBy: Types.ObjectId | null,
  ) => Promise<(BrandRecord & { _id: Types.ObjectId }) | null>;
};

const brandRepository = brandRepositoryModule as unknown as BrandRepositoryModule;
const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};
const noopAuditLog = async () => undefined;

const originalRepository: BrandRepositoryModule = {
  findBrandById: brandRepository.findBrandById,
  findBrandBySlug: brandRepository.findBrandBySlug,
  createBrand: brandRepository.createBrand,
  updateBrandById: brandRepository.updateBrandById,
  softDeleteBrandById: brandRepository.softDeleteBrandById,
};

const brandId = new Types.ObjectId();
const actorId = new Types.ObjectId().toString();

const buildBrand = (
  overrides: Partial<BrandRecord & { _id: Types.ObjectId }> = {},
): BrandRecord & { _id: Types.ObjectId } => ({
  _id: brandId,
  name: 'Amul',
  slug: 'amul',
  description: null,
  logoUrl: null,
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

const isAppErrorWithCode = (error: unknown, code: string) =>
  error instanceof AppError && error.errorCode === code;

beforeEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
});

afterEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
  brandRepository.findBrandById = originalRepository.findBrandById;
  brandRepository.findBrandBySlug = originalRepository.findBrandBySlug;
  brandRepository.createBrand = originalRepository.createBrand;
  brandRepository.updateBrandById = originalRepository.updateBrandById;
  brandRepository.softDeleteBrandById = originalRepository.softDeleteBrandById;
});

test('createBrand creates brand with generated slug', async () => {
  brandRepository.findBrandBySlug = async () => null;
  brandRepository.createBrand = async (payload) => buildBrand({ ...payload, _id: brandId });

  const created = await createBrand({ name: 'Amul' }, actorId);

  assert.equal(created.slug, 'amul');
});

test('createBrand rejects duplicate slug', async () => {
  brandRepository.findBrandBySlug = async () => buildBrand();

  await assert.rejects(
    () => createBrand({ name: 'Amul', slug: 'amul' }, actorId),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[BRAND_ERROR_CODES.BRAND_SLUG_ALREADY_EXISTS]),
  );
});

test('getBrandById returns not found for missing brand', async () => {
  brandRepository.findBrandById = async () => null;

  await assert.rejects(
    () => getBrandById(brandId.toString()),
    (error: unknown) => isAppErrorWithCode(error, ERROR_CODES[BRAND_ERROR_CODES.BRAND_NOT_FOUND]),
  );
});

test('updateBrand updates fields', async () => {
  const existing = buildBrand();
  brandRepository.findBrandById = async () => existing;
  brandRepository.findBrandBySlug = async () => null;
  brandRepository.updateBrandById = async (_id, payload) =>
    buildBrand({ ...existing, ...payload, name: 'Amul Fresh' });

  const updated = await updateBrand(brandId.toString(), { name: 'Amul Fresh' }, actorId);

  assert.equal(updated.name, 'Amul Fresh');
});

test('deleteBrand soft deletes brand', async () => {
  brandRepository.findBrandById = async () => buildBrand();
  brandRepository.softDeleteBrandById = async () =>
    buildBrand({ isDeleted: true, status: 'archived' });

  const deleted = await deleteBrand(brandId.toString(), actorId);
  assert.equal(deleted.slug, 'amul');
});
