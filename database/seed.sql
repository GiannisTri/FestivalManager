-- ==========================================
-- Festival Manager Seed Data
-- PostgreSQL
-- ==========================================

INSERT INTO festivals (name, start_date, end_date)
VALUES
    ('Νέα Ηρακλείτσα', '2026-08-20', '2026-08-24'),
    ('Νέα Πέραμος', '2026-08-13', '2026-08-15'),
    ('Οφρύνιο', '2026-07-29', '2026-08-07');

INSERT INTO users (username, password_hash, role)
VALUES
    (
        'admin',
        '$2b$10$mIoWw5jgwoGeXI1FYiCQB.T7a1tOnGeelTN4H2sh6LsWJH7PSYf0a',
        'admin'
    );
     (
        'hraklis',
        '$2b$10$NoMeRdajRtQ3wJWLOdgKKOKbgk6FUegRVzLlKGln6UHf9ZcBSrKF2',
        'admin'
    );
     (
        'kwstas',
        '$2b$10$wywdv8M2FEnIIGafxA737.bqVY2eG7UGyXu.DgLbnZmaVAJrb81jm',
        'admin'
    );