import mysql.connector
from mysql.connector import errorcode
import config as config
import sys
import json
import cgi

output = {}

try: 
    cnx = mysql.connector.connect(
        host = config.mysql["host"],
        user = config.mysql["user"],
        password = config.mysql["password"],
        port = config.mysql["port"],
        database = config.mysql["dbname"]
    ) 
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR or err.errno == errorcode.ER_BAD_DB_ERROR:
        output["status_code"] = "300"
        output["status_name"] = "failure"
        output["status_description"] = "database unavailable"
    else:
        print(err)

output["status_code"] = "200"
output["status_name"] = "ok"
output["status_description"] = "success"

# Use this to act as placeholders alongside .format(fs["name"], fs["location_id"]) etc
# fs = cgi.FieldStorage()

sys.stdout.write("Content-Type: application/json; charset=UTF-8")
sys.stdout.write("\n")
sys.stdout.write("\n")

mycursor = cnx.cursor()
mycursor.execute("SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.lastName, p.firstName, d.name, l.name")
myresult = mycursor.fetchall()

output["data"] = myresult

sys.stdout.write(json.dumps(output["data"], indent=1))

# output["data"] = mycursor.fetchall()
# # sys.stdout.write(json.dumps(output["data"]))
# result = json.dumps(output["data"])
# print(result)

cnx.close()