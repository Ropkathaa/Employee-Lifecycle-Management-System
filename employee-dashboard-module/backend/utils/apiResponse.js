class ApiResponse {
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data = null, message = "Created successfully") {
    return ApiResponse.success(res, data, message, 201);
  }

  static error(res, message = "Server Error", statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
    };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }

  static paginated(res, data, total, page, limit, message = "Success") {
    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }
}

module.exports = ApiResponse;

