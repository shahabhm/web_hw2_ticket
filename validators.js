import {body, validationResult} from 'express-validator';

const IATA_LEN = 3;
export const flight_search_validation_rules = () => {
    return [
        body('departure').isDate(),
        body('origin').isLength({min: IATA_LEN, max: IATA_LEN}),
        body('dest').isLength({min: IATA_LEN, max: IATA_LEN}),
    ]
}

export const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}
