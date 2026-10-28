-- Seed tài khoản admin local cho môi trường phát triển
-- Email: admin@vietvi.vn, Role: ADMIN
INSERT INTO users (id, email, status, email_verified_at, created_at, updated_at)
VALUES (
    '018f0000-0000-7000-8000-000000000001',
    'admin@vietvi.vn',
    'ACTIVE',
    now(),
    now(),
    now()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role, granted_at)
VALUES (
    '018f0000-0000-7000-8000-000000000001',
    'ADMIN',
    now()
) ON CONFLICT (user_id, role) DO NOTHING;
