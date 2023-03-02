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

CREATE TABLE course (
    id varchar(255) PRIMARY KEY,
    name varchar(255),
    description varchar(255)
);

CREATE TABLE student_courses (
    student_id varchar(255) REFERENCES student(id),
    course_id varchar(255) REFERENCES course(id),
    PRIMARY KEY (student_id, course_id)
);

CREATE TABLE lessons
(
    lesson_id   varchar(255) PRIMARY KEY,
    course_id   varchar(255) REFERENCES course(id),
    title       varchar(255),
    description text,
    preview_image varchar(255),
    material varchar(255),
    start_time  TIMESTAMP default Now(),
    end_time    TIMESTAMP NOT NULL
);

-- CREATE TABLE grades (
--     id varchar(255) PRIMARY KEY,
--     student_id varchar(255) REFERENCES student(id),
--     lesson_id varchar (255) REFERENCES lessons(lesson_id),
--     grade integer,
--     start_time  TIMESTAMP default Now()
-- );

CREATE TABLE quiz
(
    quiz_id   varchar(255) PRIMARY KEY,
    lesson_id   varchar(255) REFERENCES lessons(lesson_id),
    title       varchar(255),
    duration time,
    total_points integer,
    created_at TIMESTAMP default Now(),
    updated_at TIMESTAMP,
    is_active boolean,
    start_time time,
    end_time time
);

CREATE TABLE question
(
    question_id   varchar(255) PRIMARY KEY,
    quiz_id varchar(255) REFERENCES quiz(quiz_id),
    question varchar(255),
    type character(255),
    options character(1000),
    correct_answer character(1000),
    created_at TIMESTAMP default Now(),
    updated_at TIMESTAMP,
);

