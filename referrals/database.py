import os.path
import sqlite3

def connect_db():
    if not os.path.exists('user.db'):
        conn = sqlite3.connect('user.db', check_same_thread=False)
        c = conn.cursor()
        c.execute(
            """
            create table User(
                phone integer not null primary key,
                referral text not null,
                firstname text not null,
                lastname text not null,
                college text not null,
                year integer not null,
                branch text not null
            );
            """
        )
        c.execute(
            """
            create table Otp(
                phone integer not null primary key,
                name text not null,
                otp integer not null
            );
            """
        )
        conn.commit()
        conn.close()
    return sqlite3.connect('user.db', check_same_thread=False)