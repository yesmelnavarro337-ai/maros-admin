export type CollectionId = string;

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  accentHex: string;
  isDefault: boolean;
  productIds: string[];
}