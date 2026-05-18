export type VendorMediaFilePurpose = 'product_image' | 'store_asset' | 'document' | 'other';

export type VendorMediaFile = {
  id: string;
  originalFileName: string;
  publicUrl: string | null;
  mimeType: string;
  filePurpose: string;
  status: string;
  createdAt: string;
};

export type VendorMediaUploadPayload = {
  filePurpose: VendorMediaFilePurpose;
  ownerType?: string;
  ownerId?: string;
  isPublic?: boolean;
};
