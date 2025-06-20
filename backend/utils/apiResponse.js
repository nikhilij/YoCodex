class ApiResponse {
   constructor(statusCode, data, message = "Success", pagination = null) {
      this.statusCode = statusCode;
      this.data = data;
      this.message = message;
      this.success = statusCode < 400;
      this.timestamp = new Date().toISOString();

      if (pagination) {
         this.pagination = pagination;
      }
   }

   static success(res, data, message = "Success", statusCode = 200, pagination = null) {
      return res.status(statusCode).json(new ApiResponse(statusCode, data, message, pagination));
   }

   static error(res, message = "Error", statusCode = 500, errors = null) {
      const response = {
         statusCode,
         message,
         success: false,
         timestamp: new Date().toISOString(),
      };

      if (errors) {
         response.errors = errors;
      }

      return res.status(statusCode).json(response);
   }

   static paginate(totalDocs, limit, page, totalPages, hasPrevPage, hasNextPage) {
      return {
         totalDocs,
         limit,
         page,
         totalPages,
         hasPrevPage,
         hasNextPage,
         prevPage: hasPrevPage ? page - 1 : null,
         nextPage: hasNextPage ? page + 1 : null,
      };
   }
}

module.exports = ApiResponse;
