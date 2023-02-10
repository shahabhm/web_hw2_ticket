-- ON DELETE CASCADES are dirty...
DROP TABLE IF EXISTS ticket;

DROP TABLE IF EXISTS receipt;

CREATE TABLE receipt (
    receipt_id      SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL,
    state           VARCHAR(20) NOT NULL,
    price           INTEGER NOT NULL
);

CREATE TABLE ticket (
    ticket_id       SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL,
    flight_serial   INTEGER NOT NULL REFERENCES flight ON DELETE NO ACTION ON UPDATE NO ACTION,
    passenger_name  VARCHAR(100) NOT NULL,
    n_id            VARCHAR(100) NOT NULL,
    receipt_id       INTEGER NOT NULL REFERENCES receipt ON DELETE CASCADE ON UPDATE CASCADE
);
--
-- INSERT INTO receipt (receipt_id, user_id, state, price) VALUES
--         (1, 1, 1, 120);
--
-- INSERT INTO ticket  (ticket_id      ,user_id        ,flight_serial      ,passenger_name ,n_id, receipt_id) VALUES
--     (1, 1, 2, 'shahab hosseini', 12345, 1);

