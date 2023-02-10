import {DataTypes, Sequelize, Op} from 'sequelize';

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/flight') // Example for postgres

const dbOpts = function (db_name) {
    return {
        tableName: db_name,
        createdAt: false,
        updatedAt: false,
    }
};

export const City = sequelize.define('city', {
    country_name: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    city_name: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    timezone_name: DataTypes.STRING
}, dbOpts('city'));

export const Airport = sequelize.define('airport', {
        country_name: {
            type: DataTypes.STRING,
        },
        city_name: {
            type: DataTypes.STRING,
        },
        airport_name: {
            type: DataTypes.STRING,
        },
        iata_code: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
    },
    dbOpts('airport')
);

export const Flight = sequelize.define('flight', {
        flight_serial: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        flight_id: DataTypes.STRING,
        origin: DataTypes.STRING,
        destination: DataTypes.STRING,
        aircraft: DataTypes.STRING,
        departure_utc: DataTypes.TIME,
        duration: DataTypes.STRING, // ?
        y_price: DataTypes.INTEGER,
        j_price: DataTypes.INTEGER,
        f_price: DataTypes.INTEGER,
    },
    dbOpts('flight')
);


export const Ticket = sequelize.define('ticket', {
    ticket_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: DataTypes.INTEGER,
    flight_serial: DataTypes.INTEGER,
    passenger_name: DataTypes.STRING,
    n_id: DataTypes.STRING,
    receipt_id: DataTypes.INTEGER,
}, dbOpts('ticket'));

export const Receipt = sequelize.define('receipt', {
    receipt_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: DataTypes.INTEGER,
    state: DataTypes.STRING,
    price: DataTypes.INTEGER,
}, dbOpts('receipt'));

export const find_flight = function (search_options) {

    let dateA = search_options.departure + " 00:00:00";
    let dateB = search_options.departure + " 23:59:59";

    return Flight.findAll({
        where: {
            [Op.and]: {
                departure_utc: {
                    [Op.between]: [dateA, dateB]
                },
                origin: search_options.origin,
                destination: search_options.dest
            },
        }
    })
}


/*
    we probably want to find flight by its user
 */
export const find_tickets = function (search_options) {
    return Ticket.findAll({
        where: {
            user_id: search_options.user_id
        }
    });

}

export const find_receipts_by_user = function (search_options){
    return Receipt.findAll({
        where:{
            user_id: search_options.user_id
        }
    })
}

export const find_receipts_by_id = function (search_options){
    return Receipt.findAll({
        where:{
            receipt_id: search_options.receipt_id
        }
    })
}

export const create_receipt = function (receipt){
     return Receipt.create({
        user_id: receipt.user_id,
        state: "created",
        price: receipt.price,
    });
}

export const create_ticket = function (ticket) {
    return Ticket.create({
        user_id: ticket.user_id,
        flight_serial: ticket.flight_serial,
        passenger_name: ticket.passenger_name,
        n_id: ticket.n_id,
        receipt_id: ticket.receipt_id,
    })
}

export const test_database = async function () {
    return sequelize.authenticate();
}

