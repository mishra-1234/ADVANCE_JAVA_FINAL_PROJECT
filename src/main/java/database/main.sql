

DROP DATABASE IF EXISTS cyber_incident_db;
CREATE DATABASE cyber_incident_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cyber_incident_db;


CREATE TABLE admin (
                       id        INT          NOT NULL AUTO_INCREMENT,
                       email     VARCHAR(100) NOT NULL,
                       password  VARCHAR(255) NOT NULL,
                       PRIMARY KEY (id),
                       UNIQUE KEY uq_admin_email (email)
) ENGINE=InnoDB;


CREATE TABLE users (
                       id           INT          NOT NULL AUTO_INCREMENT,
                       full_name    VARCHAR(100) NOT NULL,
                       employee_id  VARCHAR(50)  NOT NULL,
                       email        VARCHAR(100) NOT NULL,
                       department   VARCHAR(50)  NOT NULL,
                       password     VARCHAR(255) NOT NULL,
                       role         VARCHAR(20)  NOT NULL DEFAULT 'EMPLOYEE',
                       created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       PRIMARY KEY (id),
                       UNIQUE KEY uq_users_employee_id (employee_id),
                       UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;


CREATE TABLE security_incidents (
                                    id                   INT          NOT NULL AUTO_INCREMENT,
                                    incident_title       VARCHAR(150) NOT NULL,
                                    incident_category    VARCHAR(50)  NOT NULL,
                                    incident_severity    VARCHAR(20)  NOT NULL,
                                    incident_date        DATE         NOT NULL,
                                    incident_time        TIME         NOT NULL,
                                    affected_asset       VARCHAR(100) DEFAULT NULL,
                                    incident_location    VARCHAR(100) DEFAULT NULL,
                                    incident_description TEXT,
                                    incident_evidence    VARCHAR(255) DEFAULT NULL,
                                    contact_info         VARCHAR(100) DEFAULT NULL,
                                    reported_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    reported_by          VARCHAR(100) DEFAULT NULL,
                                    PRIMARY KEY (id),
                                    KEY idx_incident_severity (incident_severity),
                                    KEY idx_incident_category (incident_category),
                                    KEY idx_incident_date (incident_date)
) ENGINE=InnoDB;


CREATE TABLE url_scans (
                           id             INT          NOT NULL AUTO_INCREMENT,
                           scanned_url    VARCHAR(500) NOT NULL,
                           https_enabled  TINYINT(1)   NOT NULL DEFAULT 0,
                           risk_level     VARCHAR(20)  NOT NULL,
                           scan_date      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           PRIMARY KEY (id)
) ENGINE=InnoDB;



INSERT INTO admin (id, email, password) VALUES
                                            (1, 'admin@gmail.com',          'admin123'),
                                            (2, 'dibyamishra379@gmail.com', 'Dibya@1234');

INSERT INTO users (id, full_name, employee_id, email, department, password, role, created_at) VALUES
                                                                                                  (1,  'Guru Jod',         'emp123',      'gurujod5@gmail.com',       'hr',          'Dibya@1234', 'EMPLOYEE', '2026-08-28 10:27:17'),
                                                                                                  (2,  'Dibyajeet',        'emp1234',     'dibya123@gmail.com',       'operations',  'Dibya@1234', 'EMPLOYEE', '2026-08-28 10:30:00'),
                                                                                                  (3,  'Rahul',            'rp123',       'rp123@gmail.com',          'finance',     'Rahul@1234', 'EMPLOYEE', '2026-08-28 18:34:58'),
                                                                                                  (5,  'Dibyajeet Mishra', 'emp8260',     'dibyamishra379@gmail.com', 'operations',  'Dibya@1234', 'EMPLOYEE', '2026-08-29 19:17:58'),
                                                                                                  (6,  'Devloper_dev',     'emp82609',    'devloper123@gmail.com',    'hr',          'Dev@1234',   'EMPLOYEE', '2026-09-01 14:55:24'),
                                                                                                  (7,  'Rosan Kumar Das',  'CUCS219',     'dasrosan2003@gmail.com',   'it-security', 'Das@123456', 'EMPLOYEE', '2026-09-02 13:43:06'),
                                                                                                  (10, 'Samar Singh',      'emp9861',     'samar123@gmail.com',       'finance',     'Samar@1234', 'EMPLOYEE', '2026-09-24 16:50:31'),
                                                                                                  (11, 'ftqqtftg',         '1mp12345690', 'sir123@gmail.com',         'finance',     'Sir@1234',   'EMPLOYEE', '2026-10-06 10:34:58');

INSERT INTO security_incidents
(id, incident_title, incident_category, incident_severity, incident_date, incident_time,
 affected_asset, incident_location, incident_description, incident_evidence,
 contact_info, reported_at, reported_by) VALUES
                                             (1, 'Hacked',  'ransomware',          'high',     '2026-10-19', '18:37:00', 'phone',  'Jatni',   'ssssssssssssssssddddddddddddddddsssssssssssss', '', '8260976139',               '2026-10-19 16:38:24', 'Rosan Kumar Das'),
                                             (2, 'Blast',   'unauthorized-access', 'high',     '2026-10-19', '10:32:00', 'phone',  'Bhadrak', 'hyeeeeeeeeeeeeeeeeeeeeeeeeee',                 '', 'dibyamishra379@gmail.com', '2026-10-20 09:33:13', 'Rosan Kumar Das'),
                                             (3, 'cracked', 'phishing',            'critical', '2026-10-12', '00:34:00', 'tablet', 'Bhadrak', 'hyeeeeeeeeeeeeeeeeeeeeeeeeeeee',               '', 'dibyamishra379@gmail.com', '2026-10-20 09:34:34', 'Dibyajeet Mishra'),
                                             (4, 'Blast',   'suspicious-activity', 'high',     '2026-10-13', '14:21:00', 'phone',  'Bhadrak', 'helooooooooooooooo',                           '', 'dibyamishra379@gmail.com', '2026-10-20 13:21:22', 'Samar Singh'),
                                             (5, 'Hacked',  'data-breach',         'high',     '2026-10-19', '20:30:00', 'phone',  'Jatni',   'rtdddddddddddddddddddd',                       '', 'dibyamishra379@gmail.com', '2026-10-21 18:30:34', 'ftqqtftg');

INSERT INTO url_scans (id, scanned_url, https_enabled, risk_level, scan_date) VALUES
                                                                                  (1, 'https://www.youtube.com/',                         1, 'Low',  '2026-10-17 22:53:07'),
                                                                                  (2, 'https://www.youtube.com/',                         1, 'Low',  '2026-10-17 22:55:03'),
                                                                                  (3, 'http://localhost:8080/AD-PROJECT/urlScanner.jsp',  0, 'High', '2026-10-18 16:01:55');


ALTER TABLE admin              AUTO_INCREMENT = 3;
ALTER TABLE users              AUTO_INCREMENT = 12;
ALTER TABLE security_incidents AUTO_INCREMENT = 6;
ALTER TABLE url_scans          AUTO_INCREMENT = 4;