function hasProperties(...properties) {
  return function (req, res, next) {
    console.log(req.body, "ant");
    const { data = {} } = req.body;
    console.log("pelican", properties);
    console.log("datatata panda", data.capacity);
    try {
      properties.forEach((property) => {
        if (!data[property]) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasProperties;
