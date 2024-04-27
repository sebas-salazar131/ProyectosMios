
CREATE DATABASE personal_finances CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE personal_finances;

CREATE TABLE users (
    user_id CHAR(30) PRIMARY KEY,
    full_name VARCHAR(80),
    mail VARCHAR(100) UNIQUE, -- user_name
    passhash VARCHAR(140),
    user_role VARCHAR(10),
    user_status BOOL DEFAULT True,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE category (
    category_id  SERIAL PRIMARY KEY,
    category_name VARCHAR(50),
    category_description VARCHAR(120),
    category_status BOOL DEFAULT True
);

CREATE TABLE transactions (
    transactions_id SERIAL PRIMARY KEY,
    user_id CHAR(30),
    category_id INT,
    amount DECIMAL(10,2), 
    t_description VARCHAR(120),
    t_type VARCHAR(10),
    t_date DATE,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (category_id) REFERENCES category (category_id)
);

INSERT INTO user(user_id, full_name, mail, passhash, user_role) VALUES ('ergwafeqfqeewfwewef', 'Pepito Perez', 'pepito@gmail.com', '12345', 'admin');