const paginate = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return {
    query: query.skip(skip).limit(limit),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
    },
  };
};

module.exports = paginate;

