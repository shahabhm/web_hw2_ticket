import {
    Airport,
    City,
    test_database,
    create_ticket,
    find_available_offers,
    receipt_serial_generate,
    find_flight_by_id,
    successful_tickets,
    flight_id_to_serial
} from '/home/shahab/WebstormProjects/web/model.js';
import {validationResult} from "express-validator";
import axios from "axios";

const BANK_URL = 'localhost:8000'

const validation = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
}

const server_error = function (error, res) {
    console.log(error);
    res.status(500).send("database connection failed!");
}

export const get_cities = function (req, res) {
    let cities = City.findAll();
    cities.then(function (value) {
        res.send(value);
    }, function (error) {
        server_error(error, res);
    });
}

export const get_airports = function (req, res) {
    let airports = Airport.findAll();
    airports.then((value) => {
        res.send(value);
    }, (error) => {
        server_error(error, res);
    })
}

export const available_offers = function (req, res) {
    let available_offers_results = find_available_offers(req.body);
    available_offers_results.then((value) => {
        res.send(value);
    }, (error) => {
        server_error(error, res);
    })
}

export const test_runs = function (req, res) {
    let result = test_database();
    result.then((value) => {
        res.send("database connection success!");
    }, (error) => {
        server_error(error, res);
    })
}

const ticket_creator = function (req) {
    for (let i = 0; i < req.passengers.length; i++) {
        create_ticket({
            corresponding_user_id: req.USER,
            title: req.passengers[i].title,
            first_name: req.passengers[i].first_name,
            last_name: req.passengers[i].last_name,
            flight_serial: req.flight_serial,
            offer_price: req.passengers[i].offer_price,
            offer_class: req.passengers[i].offer_class,
            receipt_id: req.receipt_id,
        }).then((value) => {

        }, (error) => {
            console.log(error);
            return new Error("there was an error creating tickets");
        })
    }
}

// takes a reserve request and creates temp tickets for them.
export const reserve_ticket = async function (req, res) {
    let USER = req.USER;
    try {
        let flight_serial = await flight_id_to_serial(req.body.flight_id);
        let receipt_id = await receipt_serial_generate();
        req.body.receipt_id = parseInt(receipt_id[0].nextval);
        req = await calculate_total_price(req.body);
        req.USER = USER;
        req.flight_serial = flight_serial;
        ticket_creator(req);
        let create_transaction_result = await create_bank_transaction(req);
        create_transaction_result.bank_address = 'http://' + BANK_URL + '/payment/' + create_transaction_result.id;
        res.send(create_transaction_result);
    } catch (error) {
        return server_error(error, res);
    }
}

const calculate_total_price = async function (cart) {
    let total_price = 0;
    let flight_search_result = await find_flight_by_id(cart.flight_id);
    let flight = flight_search_result[0]
    for (let i = 0; i < cart.passengers.length; i++) {
        let passenger = cart.passengers[i];
        if (passenger.offer_class === "Y") {
            total_price += flight.y_price;
            cart.passengers[i].offer_price = flight.y_price;
        }
        if (passenger.offer_class === "J") {
            total_price += flight.j_price;
            cart.passengers[i].offer_price = flight.j_price;
        }
        if (passenger.offer_class === "F") {
            total_price += flight.f_price;
            cart.passengers[i].offer_price = flight.f_price;
        }
    }
    cart.total_price = total_price;
    cart.flight_serial = flight.flight_id;
    return cart;
}

const create_bank_transaction = async (req) => {

    const data = {
        'amount': req.total_price,
        'receipt_id': req.receipt_id,
        'callback': 'http://localhost:3000/transaction_result/id:' + req.receipt_id
    };

    let post_result = await axios.post('http://' + BANK_URL + '/transaction/', data);
    return post_result.data;
}

const bank_enum = function (state) {
    if (state == 1) {
        return "success";
    } else if (state == 2) {
        return "Input Mismatch";
    } else if (state == 3) {
        return "Expire";
    } else if (state == 4) {
        return "No Credit";
    } else if (state == 5) {
        return "Cancel";
    }
}

export const transaction_result = async function (req, res) {
    try {
        let req_url = req.url;
        let transaction_id = parseInt(req_url.split("/")[2].split(":")[1]);
        let state = req_url.split("/")[3];
        if (state === "1") {
            await successful_tickets(transaction_id);
            res.send("tickets successfully purchased");
        } else {
            res.status(406).send("purchase failed due to " + bank_enum(state));
        }
    } catch (error) {
        server_error(error, res);
    }
}