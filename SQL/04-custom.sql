-- ON DELETE CASCADES are dirty...
DROP TABLE IF EXISTS ticket;

CREATE TABLE IF NOT EXISTS ticket
(
    corresponding_user_id INTEGER,
    title                 VARCHAR,
    first_name            VARCHAR,
    last_name             VARCHAR,
    flight_serial         INTEGER,
    offer_price           INTEGER,
    offer_class           VARCHAR,
    receipt_id       INTEGER NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS reserve_counter;

--
-- INSERT INTO receipt (receipt_id, user_id, state, price) VALUES
--         (1, 1, 1, 120);
--
-- INSERT INTO ticket  (ticket_id      ,user_id        ,flight_serial      ,passenger_name ,n_id, receipt_id) VALUES
--     (1, 1, 2, 'shahab hosseini', 12345, 1);

