 create table users(
    id serial primary key,
    username text not null,
    user_type text not null
);
create table days(
    id serial primary key,
    chosen_day text not null
);
create table availability(
    id serial primary key,
    id_user int,
    id_days int,
    FOREIGN KEY(id_user) REFERENCES users(id),
    FOREIGN KEY(id_days) REFERENCES days(id)
);
INSERT INTO days (chosen_day)
VALUES ('Sunday');
INSERT INTO days (chosen_day)
VALUES ('Monday');
INSERT INTO days (chosen_day)
VALUES ('Tuesday');
INSERT INTO days (chosen_day)
VALUES ('Wednesday');
INSERT INTO days (chosen_day)
VALUES ('Thursday');
INSERT INTO days (chosen_day)
VALUES ('Friday');
INSERT INTO days (chosen_day)
VALUES ('Saturday');

SELECT * FROM availability JOIN users ON availability.id_user = users.id JOIN days ON availability.id_days = days.id

-- DELETE FROM users WHERE id=1;
-- INSERT INTO users (username, user_type)
-- VALUES ('Josephine', 'waiter');
-- INSERT INTO users (username, user_type)
-- VALUES ('Nikita', 'waiter');
-- INSERT INTO users (username, user_type)
-- VALUES ('Sibo', 'waiter');
-- INSERT INTO users (username, user_type)
-- VALUES ('Thato', 'waiter');
-- INSERT INTO users (username, user_type)
-- VALUES ('Sino', 'waiter');
-- INSERT INTO users (username, user_type)
-- VALUES ('Bantu', 'waiter');
-- INSERT INTO users (username, user_type)
-- VALUES ('Mbali', 'waiter');
-- INSERT INTO users (username, user_type)
-- VALUES ('Chuma', 'admin');

