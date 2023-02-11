import {DataTypes, Op, Sequelize} from 'sequelize';

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/flight') // Example for postgres

const dbOpts = function (db_name) {
    return {
        tableName: db_name, createdAt: false, updatedAt: false,
    }
};

export const City = sequelize.define('city', {
    country_name: {
        type: DataTypes.STRING, primaryKey: true
    }, city_name: {
        type: DataTypes.STRING, primaryKey: true
    }, timezone_name: DataTypes.STRING
}, dbOpts('city'));

export const Airport = sequelize.define('airport', {
    country_name: {
        type: DataTypes.STRING,
    }, city_name: {
        type: DataTypes.STRING,
    }, airport_name: {
        type: DataTypes.STRING,
    }, iata_code: {
        type: DataTypes.STRING, primaryKey: true,
    },
}, dbOpts('airport'));

export const AvailableOffer = sequelize.define('available_offers', {
    flight_id: {type: DataTypes.STRING, primaryKey: true},
    origin: DataTypes.STRING,
    destination: DataTypes.STRING,
    departure_local_time: DataTypes.TIME,
    arrival_local_time: DataTypes.TIME,
    duration: DataTypes.STRING,
    y_price: DataTypes.INTEGER,
    j_price: DataTypes.INTEGER,
    f_price: DataTypes.INTEGER,
    y_class_free_capacity: DataTypes.INTEGER,
    j_class_free_capacity: DataTypes.INTEGER,
    f_class_free_capacity: DataTypes.INTEGER,
    equipment: DataTypes.STRING,
}, {
    tableName: 'available_offers', createdAt: false, updatedAt: false, indexes: []
});


export const Ticket = sequelize.define('ticket', {
    corresponding_user_id: {
        type: DataTypes.INTEGER, primaryKey: true
    },
    title: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    flight_serial: DataTypes.INTEGER,
    offer_price: DataTypes.INTEGER,
    offer_class: DataTypes.INTEGER,
    receipt_id: {
        type: DataTypes.INTEGER, primaryKey: true
    },
}, dbOpts('ticket'));

export const Purchase = sequelize.define('purchase', {
    corresponding_user_id: {
        type: DataTypes.INTEGER, primaryKey: true
    },
    title: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    flight_serial: DataTypes.INTEGER,
    offer_price: DataTypes.INTEGER,
    offer_class: DataTypes.INTEGER,
}, dbOpts('purchase'));

export const Flight = sequelize.define('flight', {
    flight_serial: {type: DataTypes.INTEGER, primaryKey: true},
    flight_id: DataTypes.STRING,
    origin: DataTypes.STRING,
    destination: DataTypes.STRING,
    aircraft: DataTypes.STRING,
    departure_utc: DataTypes.TIME,
    duration: DataTypes.STRING,
    y_price: DataTypes.INTEGER,
    j_price: DataTypes.INTEGER,
    f_price: DataTypes.INTEGER,
}, dbOpts('flight'));

export const find_available_offers = function (search_options) {

    let dateA = search_options.departure + " 00:00:00";
    let dateB = search_options.departure + " 23:59:59";

    return AvailableOffer.findAll({
        where: {
            [Op.and]: {
                departure_local_time: {
                    [Op.between]: [dateA, dateB]
                },
                origin: search_options.origin,
                destination: search_options.dest,
                y_class_free_capacity: {[Op.gte]: search_options.y_class_free_capacity},
                j_class_free_capacity: {[Op.gte]: search_options.j_class_free_capacity},
                f_class_free_capacity: {[Op.gte]: search_options.f_class_free_capacity},
            },
        }
    })
}


/*
    we probably want to find flight by its user
 */
export const find_tickets = function (receipt_id) {
    return Ticket.findAll({
        where: {
            receipt_id: receipt_id
        }
    });

}

export const create_ticket = function (ticket) {
    return Ticket.create({
        corresponding_user_id: ticket.corresponding_user_id,
        title: ticket.title,
        first_name: ticket.first_name,
        last_name: ticket.last_name,
        flight_serial: ticket.flight_serial,
        offer_price: ticket.offer_price,
        offer_class: ticket.offer_class,
        receipt_id: ticket.receipt_id,
    })
}

export const create_purchase_from_ticket = function (ticket) {
    return Purchase.create({
        corresponding_user_id: ticket.corresponding_user_id,
        title: ticket.title,
        first_name: ticket.first_name,
        last_name: ticket.last_name,
        flight_serial: ticket.flight_serial,
        offer_price: ticket.offer_price,
        offer_class: ticket.offer_class
    })
}

export const receipt_serial_generate = function () {
    return sequelize.query("SELECT nextval('reserve_counter')", {
        type: sequelize.Sequelize.QueryTypes.SELECT
    });
}

export const find_flight_by_id = function (id) {
    return Flight.findAll({
        where: {
            flight_id: id
        }
    })
}

export const successful_tickets = async function (receipt_id) {
    let find_tickets_result = await find_tickets(receipt_id);
    for (let i = 0; i < find_tickets_result.length; i++) {
        let x = find_tickets_result[i];
        let ticket = x.dataValues;
        await create_purchase_from_ticket(ticket);
    }
}

export const flight_id_to_serial = async function (flight_id) {
    let find_flights = await Flight.findAll({
        where: {
            flight_id: flight_id
        }
    });
    return find_flights[0].dataValues.flight_serial;
}

export const test_database = async function () {
    return sequelize.authenticate();
}

