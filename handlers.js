import {
    Airport,
    City,
    test_database,
    find_tickets,
    create_ticket,
    find_available_offers,
    receipt_serial_generate, find_flight_by_id
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

export const get_cities = function (req, res) {
    let cities = City.findAll();
    cities.then(function (value) {
        res.send(value);
    }, function (error) {
        res.send(error);
    });
}

export const get_airports = function (req, res) {
    let airports = Airport.findAll();
    airports.then((value) => {
            res.send(value);
        },
        (error) => {
            res.send(error);
        }
    )
}

export const available_offers = function (req, res) {
    let available_offers_results = find_available_offers(req.body);
    available_offers_results.then((value) => {
            res.send(value);
        },
        (error) => {
            console.log(error);
            res.send(error);
        })
}

export const test_runs = function (req, res) {
    let result = test_database();
    result.then((value) => {
        res.send("database connection success!");
    }, (error) => {
        res.send("database connection failed!");
    })
}

const ticket_creator = function (req) {
    for (let i = 0; i < req.passengers.length; i++) {
        create_ticket({
            corresponding_user_id: req.USER,
            title: "title",
            first_name: req.passengers[i].first_name,
            last_name: req.passengers[i].last_name,
            flight_serial: req.flight_serial,
            offer_price: req.passengers[i].offer_price,
            offer_class: req.passengers[i].offer_class,
            receipt_id: req.receipt_id
        }).then(
            (value) => {
                console.log(value);
            }, (error) => {
                console.log(error);
                return new Error("there was an error creating tickets");
            }
        )
    }
}

// takes a reserve request and creates temp tickets for them.
export const reserve_ticket = async function (req, res) {
    let USER = req.USER;
    let receipt_id = await receipt_serial_generate();
    req.body.receipt_id = parseInt(receipt_id[0].nextval);
    req = await calculate_total_price(req.body);
    req.USER = USER;
    ticket_creator(req);
    let create_transaction_result = await create_bank_transaction(req);
    create_transaction_result.bank_address = 'http://'+BANK_URL+'/payment/'+create_transaction_result.id;
    // console.log(create_transaction_result);
    res.send(create_transaction_result);
}

const calculate_total_price = async function (cart) {
    let total_price = 0;
    let flight_search_result = await find_flight_by_id(cart.flight_id);
    // console.log(flight_search_result);
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

    const data = {'amount': req.total_price,
        'receipt_id': req.receipt_id,
        'callback': 'http://localhost:3000/transaction_result/id:' + req.receipt_id};

    let post_result = await axios.post('http://' + BANK_URL + '/transaction/', data);
    return post_result.data;
    //     then((res) => {
    //         console.log(`Status: ${res.status}`);
    //         console.log('Body: ', res.data);
    //     }).catch((err) => {
    //     console.error(err);
    // });
}

export const pay_reserve = (req, res) => {
    let find_receipt_result = find_receipts_by_id(req);
    find_receipt_result.then(
        (value) => {

        },
        (error) => {

        }
    );
}

export const transaction_result = function (req, res) {
    let req_url = req.url;
    let transaction_id = req_url.split("/")[2].split(":")[1];
    let state = req_url.split("/")[3];
    if (state === "1"){
        successful_tickets(transaction_id);
    }
}