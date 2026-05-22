import { useLocationContext } from '../../addresses/hooks/useLocationContext';

export const useCatalogLocationQuery = () => {
  const { cityId, selectedStoreId, hasStore } = useLocationContext();

  return {
    cityId: cityId ?? undefined,
    storeId: hasStore && selectedStoreId ? selectedStoreId : undefined,
  };
};
