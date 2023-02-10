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

export const AvailableOffer = sequelize.define('available_offers', {
        // flight_serial: {
        //     type: DataTypes.BIGINT,
        //     primaryKey: true,
        // },
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
    },
    {
        tableName: 'available_offers',
        createdAt: false,
        updatedAt: false,
        indexes: []
    }
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

export const find_available_offers = function (search_options) {

    let dateA = search_options.departure + " 00:00:00";
    let dateB = search_options.departure + " 23:59:59";

    return AvailableOffer.findAll({
        where: {
            [Op.and]: {
                departure_local_time : {
                    [Op.between]: [dateA, dateB]
                },
                origin: search_options.origin,
                destination: search_options.dest,
                y_class_free_capacity: {[Op.gte] : search_options.y_class_free_capacity},
                j_class_free_capacity: {[Op.gte] : search_options.j_class_free_capacity},
                f_class_free_capacity: {[Op.gte] : search_options.f_class_free_capacity},
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

