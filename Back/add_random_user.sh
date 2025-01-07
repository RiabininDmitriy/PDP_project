#!/bin/bash

DB_NAME="testDb"
DB_USER="testUser"
DB_PASSWORD="password"
DB_HOST="localhost"
DB_PORT="5432"
TABLE_NAME="user"

RANDOM_NAME="User$(shuf -i 1-9999 -n 1)"
RANDOM_EMAIL="user$(shuf -i 1-9999 -n 1)@example.com"
RANDOM_LASTNAME="Last$(shuf -i 1-9999 -n 1)"

SQL_QUERY="INSERT INTO \"${TABLE_NAME}\" (name, email, \"lastName\") VALUES ('$RANDOM_NAME', '$RANDOM_EMAIL', '$RANDOM_LASTNAME');"

PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$SQL_QUERY"


echo "User created:"
echo "  Name: $RANDOM_NAME"
echo "  Email: $RANDOM_EMAIL"
echo "  LastName: $RANDOM_LASTNAME"