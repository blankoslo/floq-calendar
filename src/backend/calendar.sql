DROP TABLE IF EXISTS absence_types CASCADE;
DROP TABLE IF EXISTS absence_days CASCADE;

CREATE TABLE absence_types (
    id SERIAL PRIMARY KEY,
    type TEXT
);

INSERT INTO absence_types(type) VALUES ('Ferie');

CREATE TABLE absence_days (
    id SERIAL PRIMARY KEY,
    employee INTEGER REFERENCES employees(id) NOT NULL,
    type INTEGER REFERENCES absence_types(id) NOT NULL,
    date DATE NOT NULL,
    UNIQUE(employee, date)
);
