DROP TABLE IF EXISTS absence_types;
DROP TABLE IF EXISTS absence_days;

CREATE TABLE absence_types (
    id SERIAL PRIMARY KEY,
    type TEXT
);

INSERT INTO absence_types(type) VALUES ('Ferie');

CREATE TABLE absence_days (
    id SERIAL PRIMARY KEY,
    employee INTEGER REFERENCES employees(id) NOT NULL,
    type INTEGER REFERENCES absence_types(id) NOT NULL
);
