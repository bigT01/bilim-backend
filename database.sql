create TABLE student
(
    id         varchar(255) PRIMARY KEY,
    login      varchar(255),
    full_name  varchar(255),
    password   varchar(255),
    attend     varchar(10),
    token      varchar(255),
    avatar_url varchar(255),
    created_at timestamp DEFAULT Now()
);
