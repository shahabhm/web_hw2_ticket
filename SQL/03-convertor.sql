COPY aircraft_type(type_id, manufacturer, model, series)
FROM '/home/shahab/WebstormProjects/web/SQL/aircraft_type.csv'
DELIMITER ','
CSV HEADER;

COPY aircraft_layout(layout_id, type_id, y_class_capacity, j_class_capacity, f_class_capacity)
FROM '/home/shahab/WebstormProjects/web/SQL/aircraft_layout.csv'
DELIMITER ','
CSV HEADER;

COPY aircraft_type(type_id, manufacturer, model, series)
FROM '/home/shahab/WebstormProjects/web/SQL/aircraft_layout.csv'
DELIMITER ','
CSV HEADER;

COPY aircraft(registration, layout_id)
FROM '/home/shahab/WebstormProjects/web/SQL/aircraft.csv'
DELIMITER ','
CSV HEADER;

COPY country(country_name)
FROM '/home/shahab/WebstormProjects/web/SQL/country.csv'
DELIMITER ','
CSV HEADER;

COPY city(country_name, city_name, timezone_name)
FROM '/home/shahab/WebstormProjects/web/SQL/city.csv'
DELIMITER ','
CSV HEADER;

COPY airport(country_name, city_name, airport_name, iata_code)
    FROM '/home/shahab/WebstormProjects/web/SQL/airport.csv'
    DELIMITER ','
    CSV HEADER;

COPY flight(flight_serial,flight_id,origin,destination,aircraft,departure_utc,duration,y_price,j_price,f_price)
    FROM '/home/shahab/WebstormProjects/web/SQL/flight.csv'
    DELIMITER ','
    CSV HEADER;