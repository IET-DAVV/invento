# pylint: disable=no-member
import flask
import json
import random
import re
import time
from collections import Counter
from flask import request
from flask_cors import CORS

import sheets
import database

app = flask.Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

creds = sheets.load_credentials()
sheets_api = sheets.get_sheets_api(creds)

conn = database.connect_db()
cursor = conn.cursor()

LEADERBOARD = None
count = 0
LOAD_TIME = time.time()

SPREADSHEETS = {
    '1SWRQGdd5ImD4kHmEgwX1O0wo2Nfhmb5a4YSRi2M15TY': 10,
    '1gO-4hcAuuZxTkgjQKqiRTOx3wQPGp-ArsVYoSNRE5tA': 5,
    '1UCnwrYmtv4GlrTkRxrIgSbkPJJLDkcUdhChj701LY3k': 7,
    '1AR7xNmKaNqaH7mQSGsZB4GzbNPiEd6E5Ms2zLAxLk8Y': 5
}

IET_REFCODES = {
    'CS01': 'CS A',
    'CS02': 'CS B',
    'IT01': 'IT A',
    'IT02': 'IT B',
    'ET01': 'E&TC A',
    'ET02': 'E&TC B',
    'EI00': 'E&I',
    'MC00': 'Mech',
    'CV00': 'Civil'
}

def exists(query):
    return query.fetchone()[0]

@app.route('/otp', methods=['GET'])
def generate_otp():
    required_args = ('phone', 'name', 'password')
    values = request.args
    for arg in required_args:
        if arg not in values:
            return json.dumps({
                'success': False,
                'message': "Invalid request."
            })

    query = cursor.execute(
        """
        select count(*) from Otp
        where phone = ?;
        """,
        (values['phone'],)    
    )
    if exists(query):
        msg = "Your OTP has already been generated. Contact Pradhyumna Upadhyay for OTP"
        return json.dumps({
            'success': False,
            'message': msg
        })
    
    otp = random.randint(1000, 9999)

    cursor.execute(
        """
        insert into Otp values
        (?, ?, ?);
        """,
        (
            values['phone'],
            values['name'],
            otp
        )
    )

    conn.commit()

    return json.dumps({
        'success': True,
        'message': "OTP Generated! Contact Pradhyumna Upadhyay for OTP"
    })

@app.route('/otp_admin', methods=['GET'])
def get_otps():
    query = cursor.execute(
        """
        select * from Otp;
        """
    )
    return json.dumps(query.fetchall())
    

@app.route('/add', methods=['GET'])
def add_new_user():
    required_args = ('firstname', 'lastname', 'college', 'year', 'branch', 'phone', 'otp')
    values = request.args
    for arg in required_args:
        if arg not in values:
            return json.dumps({
                'success': False,
                'message': "Invalid request."
            })

    query = cursor.execute(
        """
        select count(*) from User
        where phone = ?;
        """,
        (values['phone'],)    
    )
    if exists(query):
        return json.dumps({
            'success': False,
            'message': "A user with this phone number already exists."
        })

    valid_otp = cursor.execute(
        """
        select count(*) from Otp
        where phone = ?
        and otp = ?;
        """,
        (values['phone'], values['otp'])
    )
    if not exists(valid_otp):
        return json.dumps({
            'success': False,
            'message': "Incorrect OTP, try again."
        })

    initials = values['firstname'][0] + values['lastname'][0]
    counter = 1
    while True:
        referral = f"{initials}{counter:0>2}"
        query = cursor.execute(
            """
            select count(*) from User
            where referral = ?;
            """,
            (referral,)    
        )
        if exists(query):
            counter += 1
        else:
            break

    cursor.execute(
        """
        insert into User values
        (?, ?, ?, ?, ?, ?, ?);
        """,
        (
            values['phone'],
            referral,
            values['firstname'],
            values['lastname'],
            values['college'],
            values['year'],
            values['branch'],
        )
    )

    conn.commit()

    return json.dumps({
        'success': True,
        'message': "Referral Generated!\nReferral code: {}".format(referral),
        'code': referral
    })

@app.route('/add_admin', methods=['GET'])
def add_new_user_admin():
    required_args = ('referral', 'password', 'firstname', 'lastname',
                     'college', 'year', 'branch', 'phone')

    values = request.args
    for arg in required_args:
        if arg not in values:
            return json.dumps({
                'success': False,
                'message': "Invalid request."
            })

    query = cursor.execute(
        """
        select count(*) from User
        where phone = ?;
        """,
        (values['phone'],)    
    )
    if exists(query):
        return json.dumps({
            'success': False,
            'message': "A user with this phone number already exists."
        })

    cursor.execute(
        """
        insert into User values
        (?, ?, ?, ?, ?, ?, ?);
        """,
        (
            values['phone'],
            values['referral'].upper(),
            values['firstname'],
            values['lastname'],
            values['college'],
            values['year'],
            values['branch'],
        )
    )

    conn.commit()

    msg = "Referral Added!\nReferral code: {}".format(values['referral'].upper())
    return json.dumps({
        'success': True,
        'message': msg
    })


@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    global LEADERBOARD
    global LOAD_TIME

    if LEADERBOARD and time.time()-LOAD_TIME < 60:
        return json.dumps(LEADERBOARD)

    LOAD_TIME = time.time()
    global count
    count += 1
    referrals = {}
    for spreadsheet_id, col in SPREADSHEETS.items():
        result_body = (sheets_api
                       .spreadsheets()
                       .values()
                       .get(spreadsheetId=spreadsheet_id, range='A:T')
                       .execute())

        data = result_body.get('values', [])
        for row in data:
            if len(row) > col:
                phone = str(row[3]).strip('+').lstrip('0')
                if len(phone) > 10:
                    if phone.find('91') == 0:
                        phone = phone[2:]
                    phone = phone[:10]

                referral_field = str(row[col]).strip()
                referral = ''
                if re.findall(r'[A-Za-z]{2}', referral_field):
                    referral += re.findall(r'[A-Za-z]{2}', referral_field)[0].upper()
                else:
                    continue
                if re.findall(r'\d{2}', referral_field):
                    referral += re.findall(r'\d{2}', referral_field)[0]
                else:
                    continue
                
                referrals.update({phone: referral})
    
    sorted_referrals = sorted([list(i) for i in Counter(referrals.values()).items()],
                              key=lambda x: x[1],
                              reverse=True)

    leaderboard = []
    iet_leaderboard = []
    for user in sorted_referrals:
        referral = user[0]
        refcount = user[1]

        if referral in IET_REFCODES:
            iet_leaderboard.append({
                'referral': referral,
                'name': IET_REFCODES[referral],
                'count': refcount
            })
        else:
            query = cursor.execute(
                """
                select count(*) from User
                where referral = ?;
                """,
                (referral,)
            )
            if exists(query):
                query = cursor.execute(
                    """
                    select *
                    from User
                    where referral = ?;
                    """,
                    (referral,)
                )
                res = query.fetchone()[2:]
                name = f"{res[0].title()} {res[1].title()}"
                college = res[2]
                branch = f"{res[4]} branch"
                year_number = int(res[3])
                if year_number == 1:
                    year = '1st year'
                elif year_number == 2:
                    year = '2nd year'
                elif year_number == 3:
                    year = '3rd year'
                else:
                    year = f'{year_number}th year'
            else:
                name = college = year = branch = ''
            
            leaderboard.append({
                'referral': referral,
                'count': refcount,
                'name': name,
                'college': college,
                'branch': branch,
                'year': year
            })

    
    LEADERBOARD = {
        'referrals': referrals,
        'leaderboard': leaderboard,
        'iet_leaderboard': iet_leaderboard,
        'count': count
    }
    return json.dumps(LEADERBOARD)

@app.route('/check', methods=['GET'])
def check_data():
    if 'ref' not in request.args:
        return json.dumps({
            'success': False,
            'message': "Invalid request."
        })

    referral = request.args['ref'].upper()

    result = None

    if LEADERBOARD:
        for item in LEADERBOARD['leaderboard']:
            if item['referral'] == referral:
                result = item
                break
        else:
            for item in LEADERBOARD['iet_leaderboard']:
                if item['referral'] == referral:
                    result = item
    
    if result:
        return json.dumps({
            'success': True,
            'result': result
        })

    return json.dumps({
        'success': False,
        'message': "Referral not found."
    })
    