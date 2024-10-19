export const paginate = <T>(
  items: T[],
  { page, pageSize }: { page: number; pageSize: number }
) => {
  const totalPages = Math.ceil(items.length / pageSize);
  if (page > totalPages) return null;
  if (totalPages === 1) return { items, totalPages };
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    totalPages,
  };
};
