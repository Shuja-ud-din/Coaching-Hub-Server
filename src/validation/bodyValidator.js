import httpStatus from "http-status";

const bodyValidator = (schema) => async (req, res, next) => {
    try {
        // Access the request body, not the response body
        const isValid = await schema.validateAsync(req.body);
        next();
    } catch (err) {
        res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
    }
};

export default bodyValidator;
