import * as handlers from '/home/shahab/WebstormProjects/web/handlers.js';
import express from "express";
import bodyParser from 'body-parser';
import {available_offers_search_validation_rules, validate} from './validators.js';
const app = express();
const port = 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const get_user_from_auth = function (token) {
    console.warn("this part is not implemented yet...");
    /*
    get user here...
     */
    if(token === "baaaaaaaaaaaaaaaaaaaaaaac"){
        return "1";
    }
    else{
        return "-1";
    }
}
const check_user = function (req, res, next) {
    const token = req.headers["authorization"];
    console.log(token);
    if (typeof token !== 'undefined' && token.substring(0, 6) === "Bearer") {
        let bearer = token.substring(7);
        let user_id = get_user_from_auth(bearer);
        if (user_id === "-1") {
            res.send("invalid token");
        }
        else {
            req.USER = user_id;
            next();
        }
    }
    else {
        res.send("invalid token");
    }
}

app.post('*', check_user);

app.get('/airports', handlers.get_airports);

app.get('/runs', handlers.test_runs);

app.get('/cities', handlers.get_cities);

app.post('/available_offers',
    available_offers_search_validation_rules(),
    validate,
    handlers.available_offers);

app.post('/tickets', handlers.tickets);

app.post('/receipts', handlers.receipts);

app.post('/reserve_ticket', handlers.reserve_ticket);

