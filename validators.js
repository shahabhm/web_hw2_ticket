import {body, param, query, validationResult} from 'express-validator';

const IATA_LEN = 3;
export const available_offers_search_validation_rules = () => {
    return [
        body('departure').isDate(),
        body('origin').isLength({min: IATA_LEN, max: IATA_LEN}),
        body('dest').isLength({min: IATA_LEN, max: IATA_LEN}),
        body('y_class_free_capacity').isInt({gt: -1}),
        body('j_class_free_capacity').isInt({gt: -1}),
        body('f_class_free_capacity').isInt({gt: -1}),
    ];
}

export const reserve_validation_rules = () => {
    return [
        body('flight_id').isString(),
        body('passengers').isArray().isLength({min: 1}),
        body('passengers.*.first_name').isString(),
        body('passengers.*.offer_class').custom((value) => {
            return value === "F" || value === "J" || value === "Y";
        })
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
