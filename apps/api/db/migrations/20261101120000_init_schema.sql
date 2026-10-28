-- migrate:up
-- =====================================================================
-- VIETVI — Database schema MVP v0.1 (PostgreSQL 16)
-- Truy vết theo tài liệu "VIETVI Product & Software Requirements v0.1"
--
-- Quy ước chung
--   * Khoá chính: UUID (khuyến nghị sinh UUIDv7 ở tầng ứng dụng để có thứ tự thời gian).
--   * Tiền: BIGINT = số đồng VND (BR-02). Không dùng float/numeric thập phân cho tiền.
--   * Thời gian: TIMESTAMPTZ, lưu UTC (NFR Localization).
--   * Trạng thái: TEXT + CHECK (dễ thêm trạng thái mới bằng migration hơn ENUM).
--   * Mỗi chuyển trạng thái quan trọng có bảng *_status_history (BR-08).
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;     -- email không phân biệt hoa/thường
CREATE EXTENSION IF NOT EXISTS unaccent;   -- tìm kiếm tiếng Việt không dấu
CREATE EXTENSION IF NOT EXISTS pg_trgm;    -- tìm kiếm gần đúng

-- Hàm unaccent dạng IMMUTABLE để dùng trong cột sinh / index
CREATE OR REPLACE FUNCTION vn_unaccent(t text) RETURNS text
LANGUAGE sql IMMUTABLE PARALLEL SAFE AS
$$ SELECT public.unaccent('public.unaccent'::regdictionary, coalesce(t, '')) $$;

-- ---------------------------------------------------------------------
-- 0. TỆP TIN (dùng chung cho task, offer, message, delivery, verification, avatar)
-- ---------------------------------------------------------------------
CREATE TABLE files (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id         UUID NOT NULL,                       -- FK thêm sau khi có users
    storage_key      TEXT NOT NULL UNIQUE,                -- không bao giờ trả ra client
    original_name    TEXT NOT NULL,
    mime_type        TEXT NOT NULL,
    size_bytes       BIGINT NOT NULL CHECK (size_bytes > 0),
    checksum_sha256  TEXT,
    visibility       TEXT NOT NULL DEFAULT 'PRIVATE' CHECK (visibility IN ('PUBLIC','PRIVATE')),
    scan_status      TEXT NOT NULL DEFAULT 'PENDING'
                     CHECK (scan_status IN ('PENDING','CLEAN','INFECTED','SKIPPED')),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at       TIMESTAMPTZ
);

-- ---------------------------------------------------------------------
-- 1. ĐỊNH DANH & TÀI KHOẢN (AUTH-01..04, 4.1)
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email              CITEXT UNIQUE,                     -- NULL sau khi ẩn danh hoá
    status             TEXT NOT NULL DEFAULT 'ACTIVE'
                       CHECK (status IN ('ACTIVE','PENDING_VERIFICATION','SUSPENDED','DELETED')),
    email_verified_at  TIMESTAMPTZ,
    password_hash      TEXT,                              -- chỉ dùng nếu giữ đăng nhập mật khẩu
    last_login_at      TIMESTAMPTZ,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at         TIMESTAMPTZ,
    anonymized_at      TIMESTAMPTZ,
    CHECK (status <> 'DELETED' OR deleted_at IS NOT NULL)
);
ALTER TABLE files ADD CONSTRAINT files_owner_fk FOREIGN KEY (owner_id) REFERENCES users(id);

-- Vai trò vận hành. Requester/Tasker là ngữ cảnh, KHÔNG lưu ở đây (Role rule mục 2.3)
CREATE TABLE user_roles (
    user_id     UUID NOT NULL REFERENCES users(id),
    role        TEXT NOT NULL CHECK (role IN ('STAFF','ADMIN')),
    granted_by  UUID REFERENCES users(id),
    granted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at  TIMESTAMPTZ,
    PRIMARY KEY (user_id, role)
);

CREATE TABLE auth_otps (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         CITEXT NOT NULL,
    purpose       TEXT NOT NULL CHECK (purpose IN ('LOGIN','SIGNUP','CHANGE_EMAIL')),
    code_hash     TEXT NOT NULL,                          -- không lưu OTP dạng rõ
    attempts      SMALLINT NOT NULL DEFAULT 0,
    max_attempts  SMALLINT NOT NULL DEFAULT 5,
    expires_at    TIMESTAMPTZ NOT NULL,
    consumed_at   TIMESTAMPTZ,
    request_ip    INET,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX auth_otps_email_idx ON auth_otps (email, created_at DESC);

CREATE TABLE user_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id),
    refresh_token_hash  TEXT NOT NULL UNIQUE,
    user_agent          TEXT,
    ip                  INET,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at          TIMESTAMPTZ NOT NULL,
    revoked_at          TIMESTAMPTZ,
    revoke_reason       TEXT
);
CREATE INDEX user_sessions_user_idx ON user_sessions (user_id) WHERE revoked_at IS NULL;

-- Danh mục trường học: nền cho lọc theo trường, xác minh bằng email trường, cộng đồng theo trường
CREATE TABLE schools (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    short_name    TEXT,
    email_domain  TEXT UNIQUE,                            -- vd. hust.edu.vn
    province_code TEXT,
    status        TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE'))
);

CREATE TABLE profiles (
    user_id          UUID PRIMARY KEY REFERENCES users(id),
    display_name     TEXT NOT NULL,
    avatar_file_id   UUID REFERENCES files(id),
    bio              TEXT,
    school_id        UUID REFERENCES schools(id),
    school_other     TEXT,                                -- khi trường chưa có trong danh mục
    education_level  TEXT CHECK (education_level IN ('HIGH_SCHOOL','UNDERGRAD','POSTGRAD','GRADUATED','OTHER')),
    major            TEXT,
    graduation_year  SMALLINT,
    contact_prefs    JSONB NOT NULL DEFAULT '{}'::jsonb,
    locale           TEXT NOT NULL DEFAULT 'vi',
    timezone         TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE skills (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug    TEXT NOT NULL UNIQUE,
    name_vi TEXT NOT NULL,
    name_en TEXT,
    status  TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE'))
);
CREATE TABLE user_skills (
    user_id   UUID NOT NULL REFERENCES users(id),
    skill_id  UUID NOT NULL REFERENCES skills(id),
    level     SMALLINT CHECK (level BETWEEN 1 AND 5),
    PRIMARY KEY (user_id, skill_id)
);

-- Hồ sơ Tasker tách khỏi profile: user chỉ "trở thành Tasker" khi có dòng ở đây
CREATE TABLE tasker_profiles (
    user_id              UUID PRIMARY KEY REFERENCES users(id),
    headline             TEXT,
    status               TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','PAUSED','BLOCKED')),
    verification_status  TEXT NOT NULL DEFAULT 'NOT_VERIFIED'
                         CHECK (verification_status IN ('NOT_VERIFIED','PENDING','VERIFIED','REJECTED','EXPIRED','REVOKED')),
    verified_until       TIMESTAMPTZ,
    activated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 2. XÁC MINH TASKER (VERIFY-01, 12.1)
-- ---------------------------------------------------------------------
CREATE TABLE tasker_verifications (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id),
    status           TEXT NOT NULL DEFAULT 'PENDING'
                     CHECK (status IN ('PENDING','NEED_MORE_INFO','APPROVED','REJECTED','REVOKED','EXPIRED','CANCELLED')),
    submitted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewer_id      UUID REFERENCES users(id),
    reviewed_at      TIMESTAMPTZ,
    decision_reason  TEXT,
    expires_at       TIMESTAMPTZ
);
-- Chỉ một yêu cầu đang mở mỗi người; lịch sử các lần trước được giữ nguyên
CREATE UNIQUE INDEX tasker_verif_one_open_uidx
    ON tasker_verifications (user_id) WHERE status IN ('PENDING','NEED_MORE_INFO');

CREATE TABLE verification_evidence (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id  UUID NOT NULL REFERENCES tasker_verifications(id),
    evidence_type    TEXT NOT NULL
                     CHECK (evidence_type IN ('STUDENT_CARD','SCHOOL_EMAIL','CERTIFICATE','PORTFOLIO','ID_DOCUMENT','OTHER')),
    file_id          UUID REFERENCES files(id),
    value_text       TEXT,                                -- vd. email trường, link portfolio
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    purge_after      TIMESTAMPTZ,                         -- hạn xoá giấy tờ nhạy cảm
    CHECK (file_id IS NOT NULL OR value_text IS NOT NULL)
);

-- ---------------------------------------------------------------------
-- 3. DANH MỤC & CÔNG VIỆC (TASK-01..05, 4.2, 5.1)
-- ---------------------------------------------------------------------
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id   UUID REFERENCES categories(id),
    slug        TEXT NOT NULL UNIQUE,
    name_vi     TEXT NOT NULL,
    name_en     TEXT,
    status      TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE','ARCHIVED')),
    sort_order  INT NOT NULL DEFAULT 0,
    -- cấu hình theo danh mục (hạn mặc định, bằng chứng xác minh yêu cầu...)
    settings    JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE tasks (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_code      TEXT NOT NULL UNIQUE,                -- mã ngắn hiển thị, vd. T-7K3M9Q
    requester_id     UUID NOT NULL REFERENCES users(id),
    category_id      UUID NOT NULL REFERENCES categories(id),
    title            TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 150),
    description      TEXT NOT NULL,
    expected_output  TEXT NOT NULL,
    budget_type      TEXT NOT NULL CHECK (budget_type IN ('FIXED','RANGE')),
    budget_min       BIGINT NOT NULL CHECK (budget_min > 0),
    budget_max       BIGINT NOT NULL,
    currency         CHAR(3) NOT NULL DEFAULT 'VND',
    deadline_at      TIMESTAMPTZ NOT NULL,
    delivery_mode    TEXT NOT NULL CHECK (delivery_mode IN ('ONLINE','ONSITE','FLEXIBLE')),
    visibility       TEXT NOT NULL DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC','PRIVATE','INVITE_ONLY')),
    -- Trạng thái task chỉ mô tả vòng đời trên chợ; tiến độ thực hiện nằm ở orders
    status           TEXT NOT NULL DEFAULT 'DRAFT'
                     CHECK (status IN ('DRAFT','OPEN','AWARDED','COMPLETED','CANCELLED','EXPIRED','CLOSED')),
    moderation_state TEXT NOT NULL DEFAULT 'VISIBLE' CHECK (moderation_state IN ('VISIBLE','HIDDEN','REMOVED')),
    offer_count      INT NOT NULL DEFAULT 0,
    view_count       INT NOT NULL DEFAULT 0,
    published_at     TIMESTAMPTZ,
    expires_at       TIMESTAMPTZ,                         -- hạn nhận offer, khác deadline giao việc
    awarded_at       TIMESTAMPTZ,
    closed_at        TIMESTAMPTZ,
    cancel_reason    TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at       TIMESTAMPTZ,                         -- xoá bản nháp = xoá mềm
    row_version      INT NOT NULL DEFAULT 1,              -- khoá lạc quan khi sửa
    search_tsv       TSVECTOR GENERATED ALWAYS AS (
                        setweight(to_tsvector('simple', vn_unaccent(title)), 'A') ||
                        setweight(to_tsvector('simple', vn_unaccent(description)), 'B')
                     ) STORED,
    CHECK (budget_max >= budget_min),
    CHECK (budget_type = 'RANGE' OR budget_max = budget_min),
    CHECK (status = 'DRAFT' OR published_at IS NOT NULL)
);
CREATE INDEX tasks_feed_idx      ON tasks (status, category_id, published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX tasks_deadline_idx  ON tasks (status, deadline_at);
CREATE INDEX tasks_requester_idx ON tasks (requester_id, status, created_at DESC);
CREATE INDEX tasks_search_idx    ON tasks USING GIN (search_tsv);
CREATE INDEX tasks_title_trgm    ON tasks USING GIN (vn_unaccent(title) gin_trgm_ops);

-- Địa điểm tách riêng: phần công khai (xấp xỉ) và phần chỉ lộ sau khi có order
CREATE TABLE task_locations (
    task_id        UUID PRIMARY KEY REFERENCES tasks(id),
    province_code  TEXT NOT NULL,
    ward_code      TEXT,                                  -- sau sáp nhập 2025: tỉnh -> xã/phường
    public_label   TEXT NOT NULL,                         -- vd. "Gần ĐH Bách khoa, Hai Bà Trưng"
    address_exact  TEXT,                                  -- chỉ trả cho người trong order
    lat            NUMERIC(9,6),
    lng            NUMERIC(9,6)
);

CREATE TABLE task_attachments (
    task_id     UUID NOT NULL REFERENCES tasks(id),
    file_id     UUID NOT NULL REFERENCES files(id),
    sort_order  INT NOT NULL DEFAULT 0,
    PRIMARY KEY (task_id, file_id)
);

CREATE TABLE task_status_history (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    task_id      UUID NOT NULL REFERENCES tasks(id),
    from_status  TEXT,
    to_status    TEXT NOT NULL,
    actor_id     UUID REFERENCES users(id),               -- NULL = hệ thống (job hết hạn)
    reason       TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX task_status_history_idx ON task_status_history (task_id, created_at);

-- ---------------------------------------------------------------------
-- 4. CHÀO GIÁ (OFFER-01..02, 4.3, 5.2)
-- ---------------------------------------------------------------------
CREATE TABLE offers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id         UUID NOT NULL REFERENCES tasks(id),
    tasker_id       UUID NOT NULL REFERENCES users(id),
    proposed_price  BIGINT NOT NULL CHECK (proposed_price > 0),   -- snapshot (4.3)
    currency        CHAR(3) NOT NULL DEFAULT 'VND',
    delivery_at     TIMESTAMPTZ NOT NULL,                          -- snapshot
    message         TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING','ACCEPTED','REJECTED','WITHDRAWN','EXPIRED')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    decided_at      TIMESTAMPTZ,
    decided_reason  TEXT
);
-- Tối đa một offer đang chờ của một Tasker trên một task (4.3)
CREATE UNIQUE INDEX offers_one_pending_uidx ON offers (task_id, tasker_id) WHERE status = 'PENDING';
-- Mỗi task chỉ một offer được chấp nhận (BR-01)
CREATE UNIQUE INDEX offers_one_accepted_uidx ON offers (task_id) WHERE status = 'ACCEPTED';
CREATE INDEX offers_task_idx   ON offers (task_id, status, created_at);
CREATE INDEX offers_tasker_idx ON offers (tasker_id, status, created_at DESC);

CREATE TABLE offer_attachments (
    offer_id  UUID NOT NULL REFERENCES offers(id),
    file_id   UUID NOT NULL REFERENCES files(id),
    PRIMARY KEY (offer_id, file_id)
);

-- ---------------------------------------------------------------------
-- 5. PHÍ NỀN TẢNG (BR-03, mục 11) — có phiên bản, không sửa dòng cũ
-- ---------------------------------------------------------------------
CREATE TABLE fee_rules (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code               TEXT NOT NULL,                     -- vd. STANDARD
    version            INT NOT NULL,
    category_id        UUID REFERENCES categories(id),    -- NULL = áp dụng chung
    requester_fee_bps  INT NOT NULL DEFAULT 0 CHECK (requester_fee_bps BETWEEN 0 AND 10000),
    tasker_fee_bps     INT NOT NULL DEFAULT 0 CHECK (tasker_fee_bps BETWEEN 0 AND 10000),
    min_fee            BIGINT NOT NULL DEFAULT 0,
    max_fee            BIGINT,
    effective_from     TIMESTAMPTZ NOT NULL,
    effective_to       TIMESTAMPTZ,
    created_by         UUID REFERENCES users(id),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (code, version)
);

-- ---------------------------------------------------------------------
-- 6. ĐƠN HÀNG (ORDER-01..05, 4.4, 5.3)
-- ---------------------------------------------------------------------
CREATE TABLE orders (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_code      TEXT NOT NULL UNIQUE,                -- vd. O-2610-00123
    task_id          UUID NOT NULL REFERENCES tasks(id),
    offer_id         UUID NOT NULL UNIQUE REFERENCES offers(id),
    requester_id     UUID NOT NULL REFERENCES users(id),
    tasker_id        UUID NOT NULL REFERENCES users(id),
    -- Snapshot tiền tại thời điểm chấp nhận (mục 11)
    agreed_price     BIGINT NOT NULL CHECK (agreed_price > 0),
    currency         CHAR(3) NOT NULL DEFAULT 'VND',
    fee_rule_id      UUID REFERENCES fee_rules(id),
    requester_fee    BIGINT NOT NULL DEFAULT 0 CHECK (requester_fee >= 0),
    tasker_fee       BIGINT NOT NULL DEFAULT 0 CHECK (tasker_fee >= 0),
    requester_total  BIGINT GENERATED ALWAYS AS (agreed_price + requester_fee) STORED,
    tasker_payout    BIGINT GENERATED ALWAYS AS (agreed_price - tasker_fee) STORED,
    -- Tiến độ công việc và trạng thái tiền tách thành hai trục
    status           TEXT NOT NULL DEFAULT 'IN_PROGRESS'
                     CHECK (status IN ('AWAITING_PAYMENT','IN_PROGRESS','DELIVERED','REVISION_REQUESTED',
                                       'COMPLETED','DISPUTED','CANCELLED')),
    payment_status   TEXT NOT NULL DEFAULT 'NOT_REQUIRED'
                     CHECK (payment_status IN ('NOT_REQUIRED','PENDING','HELD','RELEASED',
                                               'REFUNDED','PARTIALLY_REFUNDED','FAILED')),
    due_at           TIMESTAMPTZ NOT NULL,
    revision_count   SMALLINT NOT NULL DEFAULT 0,
    max_revisions    SMALLINT,                            -- NULL = không giới hạn
    started_at       TIMESTAMPTZ,
    delivered_at     TIMESTAMPTZ,
    completed_at     TIMESTAMPTZ,
    auto_complete_at TIMESTAMPTZ,                         -- tự nghiệm thu nếu requester im lặng
    cancelled_at     TIMESTAMPTZ,
    cancel_reason    TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    row_version      INT NOT NULL DEFAULT 1,
    CHECK (requester_id <> tasker_id),
    CHECK (tasker_fee <= agreed_price)
);
-- Một task chỉ có một order còn hiệu lực (BR-01); order huỷ không chặn mở lại task
CREATE UNIQUE INDEX orders_one_active_per_task_uidx ON orders (task_id) WHERE status <> 'CANCELLED';
CREATE INDEX orders_requester_idx ON orders (requester_id, status, created_at DESC);
CREATE INDEX orders_tasker_idx    ON orders (tasker_id, status, created_at DESC);
CREATE INDEX orders_due_idx       ON orders (status, due_at);
CREATE INDEX orders_autocomplete_idx ON orders (auto_complete_at) WHERE status = 'DELIVERED';

CREATE TABLE order_status_history (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id     UUID NOT NULL REFERENCES orders(id),
    from_status  TEXT,
    to_status    TEXT NOT NULL,
    actor_id     UUID REFERENCES users(id),
    reason       TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX order_status_history_idx ON order_status_history (order_id, created_at);

-- Bàn giao nhiều phiên bản; một phiên bản cuối được chấp nhận (4.4)
CREATE TABLE deliveries (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id         UUID NOT NULL REFERENCES orders(id),
    version          INT NOT NULL CHECK (version >= 1),
    submitted_by     UUID NOT NULL REFERENCES users(id),
    note             TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'SUBMITTED'
                     CHECK (status IN ('SUBMITTED','REVISION_REQUESTED','ACCEPTED','SUPERSEDED')),
    revision_reason  TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    decided_at       TIMESTAMPTZ,
    decided_by       UUID REFERENCES users(id),
    UNIQUE (order_id, version),
    CHECK (status <> 'REVISION_REQUESTED' OR revision_reason IS NOT NULL)
);
CREATE UNIQUE INDEX deliveries_one_accepted_uidx ON deliveries (order_id) WHERE status = 'ACCEPTED';

CREATE TABLE delivery_files (
    delivery_id  UUID NOT NULL REFERENCES deliveries(id),
    file_id      UUID NOT NULL REFERENCES files(id),
    PRIMARY KEY (delivery_id, file_id)
);

-- ---------------------------------------------------------------------
-- 7. TRÒ CHUYỆN (ORDER-02) — gắn vào conversation thay vì gắn thẳng order
--    để sau này mở được hỏi-đáp trước khi chốt offer, hoặc kênh hỗ trợ
-- ---------------------------------------------------------------------
CREATE TABLE conversations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind        TEXT NOT NULL CHECK (kind IN ('ORDER','OFFER_QA','SUPPORT')),
    order_id    UUID UNIQUE REFERENCES orders(id),
    offer_id    UUID UNIQUE REFERENCES offers(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    locked_at   TIMESTAMPTZ,                              -- khoá khi order đóng / bị can thiệp
    CHECK ((kind = 'ORDER'    AND order_id IS NOT NULL) OR
           (kind = 'OFFER_QA' AND offer_id IS NOT NULL) OR
           (kind = 'SUPPORT'))
);

CREATE TABLE conversation_participants (
    conversation_id  UUID NOT NULL REFERENCES conversations(id),
    user_id          UUID NOT NULL REFERENCES users(id),
    role             TEXT NOT NULL CHECK (role IN ('REQUESTER','TASKER','STAFF','ADMIN')),
    joined_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_read_at     TIMESTAMPTZ,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id  UUID NOT NULL REFERENCES conversations(id),
    sender_id        UUID REFERENCES users(id),           -- NULL = tin hệ thống
    kind             TEXT NOT NULL DEFAULT 'TEXT' CHECK (kind IN ('TEXT','FILE','SYSTEM')),
    body             TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    edited_at        TIMESTAMPTZ,
    deleted_at       TIMESTAMPTZ,                         -- người gửi xoá
    hidden_at        TIMESTAMPTZ,                         -- kiểm duyệt ẩn
    hidden_by        UUID REFERENCES users(id)
);
CREATE INDEX messages_conv_idx ON messages (conversation_id, created_at);

CREATE TABLE message_attachments (
    message_id  UUID NOT NULL REFERENCES messages(id),
    file_id     UUID NOT NULL REFERENCES files(id),
    PRIMARY KEY (message_id, file_id)
);

-- ---------------------------------------------------------------------
-- 8. TRANH CHẤP — thực thể riêng, không lẫn với report
-- ---------------------------------------------------------------------
CREATE TABLE disputes (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id         UUID NOT NULL REFERENCES orders(id),
    opened_by        UUID NOT NULL REFERENCES users(id),
    reason_code      TEXT NOT NULL CHECK (reason_code IN ('NOT_DELIVERED','LATE','QUALITY','SCOPE_CHANGE','PAYMENT','OTHER')),
    description      TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','UNDER_REVIEW','RESOLVED','WITHDRAWN')),
    assigned_to      UUID REFERENCES users(id),
    resolution       TEXT CHECK (resolution IN ('RELEASE_TO_TASKER','REFUND_REQUESTER','SPLIT','CONTINUE_WORK','CANCEL_ORDER')),
    refund_amount    BIGINT CHECK (refund_amount >= 0),
    resolution_note  TEXT,
    resolved_by      UUID REFERENCES users(id),
    opened_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at      TIMESTAMPTZ,
    CHECK (status <> 'RESOLVED' OR (resolution IS NOT NULL AND resolved_by IS NOT NULL))
);
CREATE UNIQUE INDEX disputes_one_open_uidx ON disputes (order_id) WHERE status IN ('OPEN','UNDER_REVIEW');

-- ---------------------------------------------------------------------
-- 9. THANH TOÁN & SỔ CÁI (mục 11) — dùng được cho cả cổng thanh toán lẫn đối soát tay
-- ---------------------------------------------------------------------
CREATE TABLE payments (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id         UUID NOT NULL REFERENCES orders(id),
    direction        TEXT NOT NULL CHECK (direction IN ('PAY_IN','PAYOUT','REFUND')),
    method           TEXT NOT NULL CHECK (method IN ('GATEWAY','MANUAL_TRANSFER')),
    provider         TEXT,                                -- vd. VNPAY, PAYOS, MOMO
    provider_ref     TEXT,
    amount           BIGINT NOT NULL CHECK (amount > 0),
    currency         CHAR(3) NOT NULL DEFAULT 'VND',
    status           TEXT NOT NULL DEFAULT 'PENDING'
                     CHECK (status IN ('PENDING','SUCCEEDED','FAILED','EXPIRED','CANCELLED')),
    idempotency_key  TEXT NOT NULL UNIQUE,
    proof_file_id    UUID REFERENCES files(id),           -- chứng từ khi đối soát tay
    confirmed_by     UUID REFERENCES users(id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (provider, provider_ref)
);
CREATE INDEX payments_order_idx ON payments (order_id, created_at);

CREATE TABLE payment_webhook_events (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    provider         TEXT NOT NULL,
    event_id         TEXT NOT NULL,
    payload          JSONB NOT NULL,
    signature_valid  BOOLEAN NOT NULL,
    received_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at     TIMESTAMPTZ,
    process_error    TEXT,
    UNIQUE (provider, event_id)                           -- chống xử lý lặp (replay-safe)
);

-- Sổ cái kép: mỗi giao dịch gồm các bút toán có tổng = 0
CREATE TABLE ledger_transactions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id     UUID REFERENCES orders(id),
    payment_id   UUID REFERENCES payments(id),
    kind         TEXT NOT NULL CHECK (kind IN ('CHARGE','HOLD','RELEASE','FEE','PAYOUT','REFUND','ADJUSTMENT')),
    description  TEXT,
    created_by   UUID REFERENCES users(id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE ledger_entries (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    transaction_id  UUID NOT NULL REFERENCES ledger_transactions(id),
    account_code    TEXT NOT NULL CHECK (account_code IN
                    ('PROVIDER_CLEARING','ESCROW','PLATFORM_REVENUE','TASKER_PAYABLE','REQUESTER_REFUNDABLE')),
    user_id         UUID REFERENCES users(id),
    amount          BIGINT NOT NULL CHECK (amount <> 0),  -- dương = Nợ, âm = Có
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ledger_entries_txn_idx  ON ledger_entries (transaction_id);
CREATE INDEX ledger_entries_acct_idx ON ledger_entries (account_code, user_id, created_at);

-- Kiểm tra cân bằng khi COMMIT
CREATE OR REPLACE FUNCTION ledger_check_balanced() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF (SELECT coalesce(sum(amount),0) FROM ledger_entries WHERE transaction_id = NEW.transaction_id) <> 0 THEN
        RAISE EXCEPTION 'Ledger transaction % is not balanced', NEW.transaction_id;
    END IF;
    RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER ledger_balanced_trg
    AFTER INSERT ON ledger_entries DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION ledger_check_balanced();

-- ---------------------------------------------------------------------
-- 10. ĐÁNH GIÁ & CHỈ SỐ UY TÍN (TRUST-01..02, BR-05)
-- ---------------------------------------------------------------------
CREATE TABLE reviews (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id      UUID NOT NULL REFERENCES orders(id),
    reviewer_id   UUID NOT NULL REFERENCES users(id),
    reviewee_id   UUID NOT NULL REFERENCES users(id),
    direction     TEXT NOT NULL CHECK (direction IN ('TO_TASKER','TO_REQUESTER')),
    rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    body          TEXT,
    status        TEXT NOT NULL DEFAULT 'PUBLISHED'
                  CHECK (status IN ('PENDING_BLIND','PUBLISHED','HIDDEN','REMOVED')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at  TIMESTAMPTZ,
    UNIQUE (order_id, reviewer_id),
    CHECK (reviewer_id <> reviewee_id)
);
CREATE INDEX reviews_reviewee_idx ON reviews (reviewee_id, status, created_at DESC);

-- Bảng tổng hợp để hiển thị nhanh trên thẻ task / hồ sơ; cập nhật bằng worker
CREATE TABLE user_stats (
    user_id                  UUID PRIMARY KEY REFERENCES users(id),
    tasks_posted             INT NOT NULL DEFAULT 0,
    orders_completed_as_req  INT NOT NULL DEFAULT 0,
    orders_completed_as_tsk  INT NOT NULL DEFAULT 0,
    rating_sum_as_tasker     INT NOT NULL DEFAULT 0,
    rating_cnt_as_tasker     INT NOT NULL DEFAULT 0,
    rating_sum_as_requester  INT NOT NULL DEFAULT 0,
    rating_cnt_as_requester  INT NOT NULL DEFAULT 0,
    on_time_delivery_cnt     INT NOT NULL DEFAULT 0,
    disputes_lost            INT NOT NULL DEFAULT 0,
    median_response_minutes  INT,
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 11. BÁO CÁO & KIỂM DUYỆT (MOD-01..02, mục 12)
-- ---------------------------------------------------------------------
CREATE TABLE reports (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id       UUID NOT NULL REFERENCES users(id),
    target_type       TEXT NOT NULL CHECK (target_type IN ('USER','TASK','OFFER','ORDER','MESSAGE','DELIVERY','REVIEW','FILE')),
    target_id         UUID NOT NULL,
    report_type       TEXT NOT NULL CHECK (report_type IN ('FRAUD','ABUSE','CONTENT','MISREPRESENTATION','TRANSACTION','SECURITY')),
    description       TEXT,
    severity          SMALLINT NOT NULL DEFAULT 2 CHECK (severity BETWEEN 1 AND 4),
    status            TEXT NOT NULL DEFAULT 'OPEN'
                      CHECK (status IN ('OPEN','TRIAGED','IN_REVIEW','RESOLVED','DISMISSED')),
    assigned_to       UUID REFERENCES users(id),
    -- Bản chụp nội dung lúc báo cáo, vì nội dung gốc có thể bị sửa/xoá sau đó
    context_snapshot  JSONB NOT NULL DEFAULT '{}'::jsonb,
    resolution_note   TEXT,
    public_outcome    TEXT,                               -- phần được phép cho người báo cáo xem
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at       TIMESTAMPTZ
);
CREATE INDEX reports_queue_idx  ON reports (status, severity DESC, created_at);
CREATE INDEX reports_target_idx ON reports (target_type, target_id);
-- Chống spam: mỗi người chỉ một báo cáo đang mở cho một đối tượng
CREATE UNIQUE INDEX reports_one_open_uidx ON reports (reporter_id, target_type, target_id)
    WHERE status IN ('OPEN','TRIAGED','IN_REVIEW');

CREATE TABLE moderation_actions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id    UUID REFERENCES reports(id),
    dispute_id   UUID REFERENCES disputes(id),
    actor_id     UUID NOT NULL REFERENCES users(id),
    action       TEXT NOT NULL CHECK (action IN ('WARN','HIDE_CONTENT','REMOVE_CONTENT','RESTORE_CONTENT',
                                                 'SUSPEND_USER','UNSUSPEND_USER','FORCE_CLOSE_TASK',
                                                 'CANCEL_ORDER','REVOKE_VERIFICATION')),
    target_type  TEXT NOT NULL,
    target_id    UUID NOT NULL,
    reason       TEXT NOT NULL,
    starts_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    ends_at      TIMESTAMPTZ,                             -- khoá tài khoản có thời hạn
    reverted_by  UUID REFERENCES users(id),
    reverted_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX moderation_target_idx ON moderation_actions (target_type, target_id, created_at DESC);

-- ---------------------------------------------------------------------
-- 12. NHẬT KÝ KIỂM TOÁN (ADMIN-03, 10.2) — chỉ được thêm, không sửa/xoá
-- ---------------------------------------------------------------------
CREATE TABLE audit_logs (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_id        UUID REFERENCES users(id),
    actor_role      TEXT NOT NULL,                        -- USER / STAFF / ADMIN / SYSTEM
    action          TEXT NOT NULL,
    entity_type     TEXT NOT NULL,
    entity_id       UUID,
    correlation_id  TEXT,
    before_data     JSONB,
    after_data      JSONB,
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip              INET,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX audit_entity_idx ON audit_logs (entity_type, entity_id, created_at);
CREATE INDEX audit_actor_idx  ON audit_logs (actor_id, created_at);

CREATE OR REPLACE FUNCTION audit_logs_block_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION 'audit_logs is append-only';
END $$;
CREATE TRIGGER audit_logs_no_update BEFORE UPDATE OR DELETE ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION audit_logs_block_change();

-- ---------------------------------------------------------------------
-- 13. THÔNG BÁO (NOTIF-01)
-- ---------------------------------------------------------------------
CREATE TABLE notifications (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id),
    type         TEXT NOT NULL,                           -- OFFER_RECEIVED, OFFER_ACCEPTED, ...
    title        TEXT NOT NULL,
    body         TEXT,
    entity_type  TEXT,
    entity_id    UUID,
    read_at      TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx   ON notifications (user_id, created_at DESC);
CREATE INDEX notifications_unread_idx ON notifications (user_id) WHERE read_at IS NULL;

CREATE TABLE notification_preferences (
    user_id  UUID NOT NULL REFERENCES users(id),
    type     TEXT NOT NULL,
    channel  TEXT NOT NULL CHECK (channel IN ('IN_APP','EMAIL','PUSH','ZALO')),
    enabled  BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (user_id, type, channel)
);

-- ---------------------------------------------------------------------
-- 14. FAQ / HỖ TRỢ (SUP-01)
-- ---------------------------------------------------------------------
CREATE TABLE faq_categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        TEXT NOT NULL UNIQUE,
    name_vi     TEXT NOT NULL,
    sort_order  INT NOT NULL DEFAULT 0
);
CREATE TABLE faq_posts (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faq_category_id  UUID REFERENCES faq_categories(id),
    author_staff_id  UUID NOT NULL REFERENCES users(id),
    slug             TEXT NOT NULL UNIQUE,
    title            TEXT NOT NULL,
    content          TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','PUBLISHED','UNPUBLISHED')),
    published_at     TIMESTAMPTZ,
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 15. HẠ TẦNG VẬN HÀNH: cấu hình, idempotency, outbox
-- ---------------------------------------------------------------------
CREATE TABLE system_settings (
    key         TEXT PRIMARY KEY,                         -- vd. otp.ttl_seconds, upload.max_mb
    value       JSONB NOT NULL,
    updated_by  UUID REFERENCES users(id),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chống bấm đúp "Chấp nhận offer", callback thanh toán lặp (7.1, mục 14 Recovery)
CREATE TABLE idempotency_keys (
    user_id        UUID NOT NULL REFERENCES users(id),
    key            TEXT NOT NULL,
    endpoint       TEXT NOT NULL,
    request_hash   TEXT NOT NULL,
    response_code  SMALLINT,
    response_body  JSONB,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at     TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (user_id, key)
);

-- Ghi sự kiện cùng giao dịch DB, worker đọc ra để gửi thông báo / analytics (mục 13, 16)
CREATE TABLE outbox_events (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    aggregate_type  TEXT NOT NULL,
    aggregate_id    UUID NOT NULL,
    event_type      TEXT NOT NULL,                        -- offer_accepted, order_completed, ...
    payload         JSONB NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at    TIMESTAMPTZ,
    attempts        INT NOT NULL DEFAULT 0
);
CREATE INDEX outbox_unpublished_idx ON outbox_events (id) WHERE published_at IS NULL;


-- migrate:down
DROP TRIGGER IF EXISTS audit_logs_no_update ON audit_logs;
DROP FUNCTION IF EXISTS audit_logs_block_change();
DROP FUNCTION IF EXISTS ledger_check_balanced();

DROP TABLE IF EXISTS outbox_events CASCADE;
DROP TABLE IF EXISTS idempotency_keys CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS faq_posts CASCADE;
DROP TABLE IF EXISTS faq_categories CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS moderation_actions CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS ledger_entries CASCADE;
DROP TABLE IF EXISTS ledger_transactions CASCADE;
DROP TABLE IF EXISTS payment_webhook_events CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS disputes CASCADE;
DROP TABLE IF EXISTS message_attachments CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS delivery_files CASCADE;
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS fee_rules CASCADE;
DROP TABLE IF EXISTS offer_attachments CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS task_status_history CASCADE;
DROP TABLE IF EXISTS task_attachments CASCADE;
DROP TABLE IF EXISTS task_locations CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS verification_evidence CASCADE;
DROP TABLE IF EXISTS tasker_verifications CASCADE;
DROP TABLE IF EXISTS tasker_profiles CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS auth_otps CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP FUNCTION IF EXISTS vn_unaccent(text);
DROP EXTENSION IF EXISTS pg_trgm;
DROP EXTENSION IF EXISTS unaccent;
DROP EXTENSION IF EXISTS citext;
DROP EXTENSION IF EXISTS pgcrypto;
