
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	initiated_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	created_by VARCHAR(255) NOT NULL,
	updated_by VARCHAR(255),
	active BOOLEAN NOT NULL DEFAULT(true)
);

INSERT INTO roles(name, initiated_at, created_by) VALUES('admin', NOW(), 1), ('passenger', NOW(), 1), ('driver', NOW(), 1);
SELECT * FROM roles;
-- ====================================================

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_title_lid INT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    alt_email VARCHAR(255),
    phone_no VARCHAR(255),
    alt_phone_no VARCHAR(255),
    dob DATE,
    blood_group VARCHAR(255),
    marital_status VARCHAR(255),
    gender_lid INT,
    org_lid INT,
    on_premise BOOLEAN,
    is_blocked BOOLEAN,
	initiated_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by INT,
    updated_by INT,
    active BOOLEAN NOT NULL DEFAULT(true)
);
INSERT INTO users(first_name, email) VALUES('Kapil', 'test@test.com');
INSERT INTO users(first_name, email) VALUES('Pax', 'pax@test.com');
SELECT * FROM users;

-- ====================================================

DROP TABLE IF EXISTS auth_type;
CREATE TABLE auth_type (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	initiated_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	created_by VARCHAR(255) NOT NULL,
	updated_by VARCHAR(255),
	active BOOLEAN NOT NULL DEFAULT(true)
);
INSERT INTO auth_type(name, initiated_at, created_by) VALUES('password', NOW(), 1), ('otp', NOW(), 1);
SELECT * FROM auth_type;
-- ====================================================

DROP TABLE IF EXISTS user_auth;
CREATE TABLE user_auth (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_lid INT NOT NULL,
	username VARCHAR(20) NOT NULL,
	password VARCHAR(255) NOT NULL,
	two_fa BOOLEAN NOT NULL DEFAULT(false),
	initiated_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	created_by VARCHAR(255) NOT NULL,
	updated_by VARCHAR(255),
	disabled BOOLEAN NOT NULL DEFAULT(false),
	active BOOLEAN NOT NULL DEFAULT(true)
);
INSERT INTO user_auth(user_lid, username, password, two_fa, initiated_at, created_by) VALUES
(1, 'admin', '$argon2id$v=19$m=65536,t=3,p=4$WmyyDuBmozvC+ZfDXxI4AA$84kosToHv1WU6V+XCkAAUbqVsn/0J3Uu2f4Ratjtq6E', true, NOW(), 1),
(2, 'pax', '$argon2id$v=19$m=65536,t=3,p=4$WmyyDuBmozvC+ZfDXxI4AA$84kosToHv1WU6V+XCkAAUbqVsn/0J3Uu2f4Ratjtq6E', false, NOW(), 1);
SELECT * FROM user_auth;
-- ====================================================

DROP TABLE IF EXISTS user_roles;
CREATE TABLE user_roles (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_lid INT NOT NULL,
	role_lid INT NOT NULL,
	initiated_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	created_by VARCHAR(255) NOT NULL,
	updated_by VARCHAR(255),
	active BOOLEAN NOT NULL DEFAULT(true)
);
INSERT INTO user_roles(user_lid, role_lid, initiated_at, created_by) VALUES(1, 1, NOW(), 1), (2, 2, NOW(), 1);
SELECT * FROM user_roles;
-- ====================================================

DROP TABLE IF EXISTS role_auth_type;
CREATE TABLE role_auth_type ( 
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	role_lid INT NOT NULL,
	role_auth_type_lid INT NOT NULL,
	initiated_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	created_by VARCHAR(255) NOT NULL,
	updated_by VARCHAR(255),
	active BOOLEAN NOT NULL DEFAULT(true)
);
INSERT INTO role_auth_type(role_lid, role_auth_type_lid, initiated_at, created_by) VALUES
(1, 1, NOW(), 1), 
(1, 2, NOW(), 1), 
(2, 1, NOW(), 1);
SELECT * FROM role_auth_type;
-- ====================================================

DROP TABLE IF EXISTS otp_type;
CREATE TABLE otp_type (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	validity_in_mins INT NOT NULL,
	initiated_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	created_by VARCHAR(255) NOT NULL,
	updated_by VARCHAR(255),
	active BOOLEAN NOT NULL DEFAULT(true)
);
INSERT INTO otp_type(name, validity_in_mins, initiated_at, created_by) VALUES
('login', 10, NOW(), 1),
('mobile_verification', 10, NOW(), 1),
('trip_start', 15, NOW(), 1), 
('trip_end', 15, NOW(), 1);
SELECT * FROM otp_type;

-- ====================================================

DROP TABLE IF EXISTS otp;
CREATE TABLE otp (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	otp INT NOT NULL,
	otp_type_lid INT NOT NULL,
	otp_for_lid INT NOT NULL,
	user_lid INT NOT NULL,
	expiry_date TIMESTAMP NOT NULL,
	initiated_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	created_by VARCHAR(255) NOT NULL,
	updated_by VARCHAR(255),
	active BOOLEAN NOT NULL DEFAULT(true)
);
SELECT * FROM otp;

-- ==================== DEVICES  =====================
DROP TABLE IF EXISTS devices;
CREATE TABLE devices (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name VARCHAR(255),
	device_token VARCHAR(255) NOT NULL UNIQUE,
	device_signature VARCHAR(255) NOT NULL,
	user_lid INT NOT NULL,
	remember BOOLEAN NOT NULL DEFAULT(false),
	verified BOOLEAN NOT NULL DEFAULT(false),
	expiry_date TIMESTAMP,
	device_name VARCHAR(255),
	device_type VARCHAR(255),
	device_model VARCHAR(255),
	client VARCHAR(255),
	os VARCHAR(255),
	initiated_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	created_by VARCHAR(255) NOT NULL,
	updated_by VARCHAR(255),
	active BOOLEAN NOT NULL DEFAULT(true)
);
SELECT * FROM devices;

-- ====================================================
DROP TABLE IF EXISTS auth_token;
CREATE TABLE auth_token (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	refresh_token VARCHAR(255) NOT NULL,
	refresh_signature VARCHAR(255) NOT NULL,
	refresh_expiry_time TIMESTAMP,
	access_token VARCHAR(255) NOT NULL,
	access_signature VARCHAR(255) NOT NULL,
	access_expiry_time TIMESTAMP,
	user_session_lid INT NOT NULL,
	user_lid INT NOT NULL,
	device_lid INT NOT NULL,
	initiated_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	created_by VARCHAR(255) NOT NULL,
	updated_by VARCHAR(255),
	parent_lid INT,
	active BOOLEAN NOT NULL DEFAULT(true)
);
SELECT * FROM auth_token;

SELECT 
-- ====================================================
 
DROP TABLE IF EXISTS user_session;
CREATE TABLE user_session (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	session_token VARCHAR(255) NOT NULL UNIQUE,
	session_signature VARCHAR(255) NOT NULL,
	user_lid INT NOT NULL,
	device_lid INT NOT NULL,
	verified BOOLEAN NOT NULL,
	login_time TIMESTAMP NOT NULL,
	logout_time TIMESTAMP, 
	session_duration INT,
	ip_addr VARCHAR(50),
	initiated_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	created_by VARCHAR(255) NOT NULL,
	updated_by VARCHAR(255),
	active BOOLEAN NOT NULL DEFAULT(true)
);
SELECT * FROM user_session WHERE;

UPDATE user_session SET active = false WHERE id = 48;

SELECT id, active FROM user_session us 
INNER JOIN auth_token au ON au.user_session_lid = us.id
WHERE au.id = 48

UPDATE user_session us SET active = false 
FROM auth_token au
WHERE au.id = 48




-- ====================================================