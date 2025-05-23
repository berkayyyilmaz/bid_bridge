-- Sample Companies
INSERT INTO companies (id, name, created_at) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Demo Shipping Company', now()),
    ('22222222-2222-2222-2222-222222222222', 'Global Logistics Inc.', now()),
    ('33333333-3333-3333-3333-333333333333', 'FastShip Carriers', now());

-- Sample Users
INSERT INTO users (id, email, password_hash, full_name, role, company_id, created_at) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@demo.com', '$2a$10$H3YeXfQrJxaK8wx7vCO.J.OYQXkXMH9sX1m9PH.QWGMDz0E4aXYD2', 'Admin User', 'ADMIN', '11111111-1111-1111-1111-111111111111', now()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'shipper@demo.com', '$2a$10$H3YeXfQrJxaK8wx7vCO.J.OYQXkXMH9sX1m9PH.QWGMDz0E4aXYD2', 'Shipper User', 'SHIPPER', '22222222-2222-2222-2222-222222222222', now()),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'carrier@demo.com', '$2a$10$H3YeXfQrJxaK8wx7vCO.J.OYQXkXMH9sX1m9PH.QWGMDz0E4aXYD2', 'Carrier User', 'CARRIER', '33333333-3333-3333-3333-333333333333', now());

-- Sample Incoterms
INSERT INTO incoterms (id, name, company_id, created_at) VALUES
    ('44444444-4444-4444-4444-444444444444', 'FOB', '11111111-1111-1111-1111-111111111111', now()),
    ('55555555-5555-5555-5555-555555555555', 'CIF', '11111111-1111-1111-1111-111111111111', now()),
    ('66666666-6666-6666-6666-666666666666', 'EXW', '22222222-2222-2222-2222-222222222222', now());

-- Sample Shipping Methods
INSERT INTO shipping_methods (id, name, company_id, created_at) VALUES
    ('77777777-7777-7777-7777-777777777777', 'Sea Freight', '11111111-1111-1111-1111-111111111111', now()),
    ('88888888-8888-8888-8888-888888888888', 'Air Freight', '11111111-1111-1111-1111-111111111111', now()),
    ('99999999-9999-9999-9999-999999999999', 'Road Transport', '22222222-2222-2222-2222-222222222222', now());

-- Sample Loading Places
INSERT INTO loading_places (id, name, company_id, created_at) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'Shanghai', '11111111-1111-1111-1111-111111111111', now()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Hong Kong', '11111111-1111-1111-1111-111111111111', now()),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Singapore', '22222222-2222-2222-2222-222222222222', now());

-- Sample Ports
INSERT INTO ports (id, name, company_id, created_at) VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Rotterdam', '11111111-1111-1111-1111-111111111111', now()),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Hamburg', '11111111-1111-1111-1111-111111111111', now()),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Los Angeles', '22222222-2222-2222-2222-222222222222', now());

-- Sample Loading Styles
INSERT INTO loading_styles (id, name, company_id, created_at) VALUES
    ('00000000-0000-0000-0000-000000000001', 'FCL', '11111111-1111-1111-1111-111111111111', now()),
    ('00000000-0000-0000-0000-000000000002', 'LCL', '11111111-1111-1111-1111-111111111111', now()),
    ('00000000-0000-0000-0000-000000000003', 'Bulk', '22222222-2222-2222-2222-222222222222', now());

-- Sample Jobs
INSERT INTO jobs (id, title, incoterm_id, shipping_method_id, loading_place_id, port_id, loading_date, loading_style_id, estimated_annual_tonnage, address, note, owner_company_id, created_at) VALUES
    ('00000000-0000-0000-0000-000000000004', 'Electronics Shipment from Shanghai to Rotterdam', '44444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '2023-10-15', '00000000-0000-0000-0000-000000000001', '500 tons', 'Shanghai Port Terminal 3', 'Priority shipment, must arrive before November', '11111111-1111-1111-1111-111111111111', now()),
    ('00000000-0000-0000-0000-000000000005', 'Textiles from Hong Kong to Hamburg', '55555555-5555-5555-5555-555555555555', '77777777-7777-7777-7777-777777777777', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2023-11-01', '00000000-0000-0000-0000-000000000002', '200 tons', 'Hong Kong Port Area B', 'Regular customer', '11111111-1111-1111-1111-111111111111', now());

-- Sample Quotes
INSERT INTO quotes (id, job_id, offering_company_id, price, currency, transit_time, valid_until, note, address, status, created_at) VALUES
    ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 15000, 'USD', 30, '2023-12-31', 'Includes all handling fees', 'Rotterdam Port Terminal 2', 'pending', now()),
    ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 14500, 'USD', 35, '2023-12-25', 'Excludes customs clearance', 'Rotterdam Port Terminal 5', 'pending', now()),
    ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 8000, 'USD', 28, '2023-12-15', 'Includes insurance', 'Hamburg Port Area C', 'pending', now());

-- Sample Notifications
INSERT INTO notifications (id, user_id, type, data, is_read, created_at) VALUES
    ('00000000-0000-0000-0000-000000000009', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'quote_submitted', '{"jobId": "00000000-0000-0000-0000-000000000004", "quoteId": "00000000-0000-0000-0000-000000000006"}', false, now()),
    ('00000000-0000-0000-0000-00000000000a', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'new_job', '{"jobId": "00000000-0000-0000-0000-000000000005"}', true, now()); 