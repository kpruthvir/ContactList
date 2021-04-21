
-- kp

DROP DATABASE IF EXISTS CONTACTS;

CREATE DATABASE CONTACTS;

USE CONTACTS;

DROP TABLE IF EXISTS CONTACT;
CREATE TABLE CONTACT(
	Contact_id	INT NOT NULL AUTO_INCREMENT,
	Fname VARCHAR(15) NOT NULL,
	Mname VARCHAR(15),
	Lname VARCHAR(15) NOT NULL,
	CONSTRAINT pk_contact PRIMARY KEY(Contact_id)
);


DROP TABLE IF EXISTS ADDRESS;
CREATE TABLE ADDRESS(
	Address_id	INT	NOT NULL AUTO_INCREMENT,
	Contact_id	INT NOt NULL,
	Address_type	VARCHAR(10),
	Address	VARCHAR(30),
	City	VARCHAR(15),
	`State`	VARCHAR(15),
	Zip		CHAR(5),
	CONSTRAINT pk_address PRIMARY KEY (Address_id),
	CONSTRAINT fk_address_contact FOREIGN KEY (Contact_id) references CONTACT(Contact_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS PHONE;
CREATE TABLE PHONE(
	Phone_id	INT NOT NULL AUTO_INCREMENT,
	Contact_id	INT NOT NULL,
	Phone_type	VARCHAR(10),
	Area_code	INT(3) CHECK (Area_code > 99 AND Area_code < 1000),
	`Number`	INT(7),
	CONSTRAINT pk_table PRIMARY KEY (Phone_id),
	CONSTRAINT fk_phone_contact FOREIGN KEY (Contact_id) references CONTACT(Contact_id) ON DELETE CASCADE
	-- 	CONSTRAINT fk_phone_contact FOREIGN KEY (Contact_id) references CONTACT(Contact_id) ON DELETE CASCADE
	--  alter TABLE address add foreign key(Contact_id) references contact(Contact_id) on DELETE CASCADE
);

DROP TABLE IF EXISTS `DATE`;
CREATE TABLE `DATE`(
	Date_id		INT NOT NULL AUTO_INCREMENT,
	Contact_id	INT NOT NULL,
	Date_type	VARCHAR(20),
	`Date`	DATE,
	CONSTRAINT pk_date PRIMARY KEY (Date_id),
	CONSTRAINT fk_date_contact FOREIGN KEY (Contact_id) references CONTACT(Contact_id) ON DELETE CASCADE
);

INSERT INTO contact VALUES (1,'Cindra','Del','Philipeaux');
INSERT INTO contact VALUES (2,'Sherwood',NULL,'Spoerl');
INSERT INTO contact VALUES (3,'Crosby',NULL,'Seide');

INSERT INTO phone VALUES (null,1,'cell',732,3927165);
INSERT INTO phone VALUES (null,1,'work',575,7806421);
INSERT INTO phone VALUES (null, 2,'home',441,5572835);
INSERT INTO PHONE VALUES (null, 2,'cell',907,9133698);
INSERT INTO PHONE VALUES (null, 2,'work',526,6913663);
INSERT INTO phone VALUES (null,3,'home',998,2394082);
INSERT INTO phone VALUES (null,3,'cell',637,7153867);
INSERT INTO phone VALUES (null,3,'work',470,3477202);
						   
INSERT INTO address VALUES (null,1,'home',null,null,null,'75018');
INSERT INTO address VALUES (null,1,'work','90103 Glacier Hill Terrace','Plano','Texas','75003');
INSERT INTO address VALUES (null,2,'home','2287 Sutteridge Park','Dallas','Texas','75062');
INSERT INTO address VALUES (null,2,'work','37 Sommers Hill','Addison','Texas','75006');
INSERT INTO address VALUES (null,3,'home',null,null,null,'75029');
INSERT INTO address VALUES (null,3,'work',null,null,null,null);

INSERT INTO `date` VALUES (null,2,'birth','1986-06-07');
INSERT INTO `date` VALUES (null,3,'birth','1965-06-23');
