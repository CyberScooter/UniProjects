create database ecofine;

\c ecofine;

create table bookmarks(    
    url varchar(255) not null,
    uid varchar(512) not null,
    company varchar(255),
    primary key(url, uid)
);

create table analytics(
    id int,
    constraint pk primary key (id),
    bookmarks int,
    totalvisitors int,
    jobsearches int 
);

INSERT INTO analytics(id, bookmarks, totalvisitors, jobsearches) values (1,0,0,0);