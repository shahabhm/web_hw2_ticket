import * as handlers from '/home/shahab/WebstormProjects/web/handlers.js';
import express from "express";
import bodyParser from 'body-parser';
import {
    available_offers_search_validation_rules, reserve_validation_rules, validate
} from './validators.js';

const app = express();
const port = 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const ignore_auth = ['/available_offers'];

const get_user_from_auth = function (token) {
    console.warn("this part is not implemented yet...");
    /*
    get user here...
     */
    if (token === "a") {
        return 1;
    } else if (token === "b") {
        return 2;
    } else {
        return -1;
    }
}
const check_user = function (req, res, next) {
    if (ignore_auth.includes(req.url)) {
        next();
        return;
    }
    const token = req.headers["authorization"];
    if (typeof token !== 'undefined' && token.substring(0, 6) === "Bearer") {
        let bearer = token.substring(7);
        let user_id = get_user_from_auth(bearer);
        if (user_id === -1) {
            res.status(400);
            res.send("invalid token");
        } else {
            req.USER = user_id;
            next();
        }
    } else {
        res.status(400);
        res.send("invalid token");
    }
}

// fine
app.post('*', check_user);

// get a list of all airports
app.get('/airports', handlers.get_airports);

// test database connection
app.get('/runs', handlers.test_runs);

// get a list of all cities
app.get('/cities', handlers.get_cities);

// search for available offers
app.post('/available_offers', available_offers_search_validation_rules(), validate, handlers.available_offers);

// creates reserve tickets for flight
app.post('/reserve_ticket', reserve_validation_rules(), validate, handlers.reserve_ticket);

// client is redirected here when bank payment is done
app.get('/transaction_result/*', handlers.transaction_result);

// app.post('/reserve_confirmation', reserve_confirmation_validation_rules(), validate, handlers.reserve_confirmation);

