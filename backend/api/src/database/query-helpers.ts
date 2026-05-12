export const buildIsNotDeletedFilter = () => {
  return {
    isDeleted: false,
  };
};

export const buildStatusFilter = (status?: string) => {
  if (!status) {
    return {};
  }

  return {
    status,
  };
};

export const buildSearchRegex = (search?: string): RegExp | undefined => {
  if (!search?.trim()) {
    return undefined;
  }

  return new RegExp(search.trim(), 'i');
};
