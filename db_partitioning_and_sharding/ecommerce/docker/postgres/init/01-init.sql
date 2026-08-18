CREATE ROLE ecommerce
    WITH LOGIN
    PASSWORD 'ecommerce'
    CREATEDB;

CREATE DATABASE ecommerce
    OWNER ecommerce;

-- Role
ALTER ROLE ecommerce
WITH LOGIN
PASSWORD 'ecommerce'
CREATEDB;

-- Database
GRANT CONNECT, TEMPORARY
ON DATABASE ecommerce
TO ecommerce;

-- Schema
GRANT USAGE, CREATE
ON SCHEMA public
TO ecommerce;

ALTER SCHEMA public OWNER TO ecommerce;