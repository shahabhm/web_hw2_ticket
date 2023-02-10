import {
    Airport,
    City,
    find_flight,
    Flight,
    test_database,
    find_tickets,
    find_receipts_by_user, create_receipt, create_ticket, find_receipts_by_id
} from '/home/shahab/WebstormProjects/web/model.js';
import {validationResult} from "express-validator";

const BANK_URL = 'localhost:8000'

const validation = function (req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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

export const search_flight = function (req, res) {
    let flight_serach_results = find_flight(req.body);
    flight_serach_results.then((value) => {
            res.send(value);
        },
        (error) => {
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

export const tickets = function (req, res) {
    let ticket_search_results = find_tickets({user_id: parseInt(req.USER)});
    ticket_search_results.then((value) => {
        res.send(value);
    }, (error) => {
        console.error(error);
        res.send("there was a problem finding your tickets...");
    })
}

export const receipts = function (req, res){
    let receipts_search_results = find_receipts_by_user({user_id: parseInt(req.USER)});
    receipts_search_results.then((value) => {
        res.send(value)
    }, (error) => {
        res.send("there was a problem finding your tickets...");
    })
}

/*    return Ticket.create({
        user_id: ticket.USER,
        flight_serial: ticket.flight_serial,
        passenger_name: ticket.passenger_name,
        n_id: ticket.n_id,
        receipt_id: ticket.receipt_id,
    })

 */
const ticket_creator = function (req) {
    for(let i = 0; i < req.body.n_id.length; i++){
        create_ticket({
            user_id: req.USER,
            flight_serial: req.body.flight_serial,
            passenger_name: req.body.passenger_name[i],
            n_id: req.body.passenger_name[i],
            receipt_id: req.body.receipt_id
        }).then(
            (value) => {
                // console.log(value);
            }, (error) => {
                console.log(error);
                return new Error("there was an error creating tickets");
            }
        )
    }
}

export const reserve_ticket = function (req, res){
    let create_receipt_result = create_receipt({user_id: 1, price: 2222});
    create_receipt_result.then(
        (value) => {
            req.body.receipt_id = value.receipt_id;
            req.body.price = value.price;
            ticket_creator(req);
            res.send("receipt created");
        },
        (error) => {
            console.log(error);
            res.send("there was a problem creating receipt...");
        }
    )
}

const create_bank_transaction = (req) => {
    fetch(BANK_URL + 'transaction', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'amount': 2233,
        receipt_id: req.body.receipt_id,
        callback: 'localhost:3000/transaction_result/id:'+req.body.receipt_id})
    })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))
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
