-- OXFOX Studio initial schema
CREATE DATABASE IF NOT EXISTS oxfox_studio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE oxfox_studio;

-- ===== TAXONOMY =====

CREATE TABLE IF NOT EXISTS categories (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  slug          VARCHAR(120) NOT NULL UNIQUE,
  description   TEXT NULL,
  banner_image  VARCHAR(255) NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categories_active_sort (is_active, sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS subcategories (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id   BIGINT UNSIGNED NOT NULL,
  name          VARCHAR(100) NOT NULL,
  slug          VARCHAR(120) NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_subcat_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY uq_subcat_slug_per_category (category_id, slug),
  INDEX idx_subcat_category (category_id)
) ENGINE=InnoDB;

-- ===== PRODUCTS =====

CREATE TABLE IF NOT EXISTS products (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id       BIGINT UNSIGNED NOT NULL,
  subcategory_id    BIGINT UNSIGNED NULL,
  name              VARCHAR(200) NOT NULL,
  slug              VARCHAR(220) NOT NULL UNIQUE,
  description       TEXT NULL,
  material          VARCHAR(100) NULL DEFAULT 'Food-grade Silicone',
  dimensions        VARCHAR(150) NULL,
  price             DECIMAL(10,2) NULL,
  is_new            BOOLEAN NOT NULL DEFAULT TRUE,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  in_stock          BOOLEAN NOT NULL DEFAULT TRUE,
  stock_qty         INT NULL,
  meta_title        VARCHAR(200) NULL,
  meta_description  VARCHAR(300) NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_products_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
  INDEX idx_products_category (category_id),
  INDEX idx_products_subcategory (subcategory_id),
  INDEX idx_products_active_created (is_active, created_at),
  FULLTEXT INDEX ft_products_search (name, description)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_images (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id    BIGINT UNSIGNED NOT NULL,
  file_path     VARCHAR(255) NOT NULL,
  file_size     INT NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_images_product_sort (product_id, sort_order)
) ENGINE=InnoDB;

-- ===== ADMIN AUTH =====

CREATE TABLE IF NOT EXISTS admin_users (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  phone         VARCHAR(15) NOT NULL UNIQUE,
  name          VARCHAR(100) NULL DEFAULT 'Admin',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS otp_requests (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  phone         VARCHAR(15) NOT NULL,
  code          VARCHAR(10) NOT NULL,
  expires_at    TIMESTAMP NOT NULL,
  used          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_otp_phone_created (phone, created_at)
) ENGINE=InnoDB;

-- ===== ANALYTICS =====

CREATE TABLE IF NOT EXISTS page_visits (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  visit_date    DATE NOT NULL,
  page_type     ENUM('homepage','category','subcategory','product','custom_order','community','faq','bulk_orders','other') NOT NULL,
  visit_count   INT UNSIGNED NOT NULL DEFAULT 0,
  UNIQUE KEY uq_visit_date_type (visit_date, page_type),
  INDEX idx_visits_date (visit_date)
) ENGINE=InnoDB;

-- ===== ORDERS =====

CREATE TABLE IF NOT EXISTS orders (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number        VARCHAR(20) NOT NULL UNIQUE,
  customer_name       VARCHAR(150) NOT NULL,
  customer_phone      VARCHAR(15) NOT NULL,
  customer_email      VARCHAR(150) NULL,
  shipping_address    TEXT NOT NULL,
  city                VARCHAR(100) NULL,
  state               VARCHAR(100) NULL,
  pincode             VARCHAR(10) NULL,
  notes               TEXT NULL,
  subtotal            DECIMAL(10,2) NOT NULL,
  status              ENUM('pending_payment','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending_payment',
  payment_method      ENUM('cod','upi','bank_transfer','unassigned') NOT NULL DEFAULT 'unassigned',
  payment_gateway_ref VARCHAR(100) NULL,
  admin_notes         TEXT NULL,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_orders_status_created (status, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id      BIGINT UNSIGNED NOT NULL,
  product_id    BIGINT UNSIGNED NULL,
  product_name  VARCHAR(200) NOT NULL,
  unit_price    DECIMAL(10,2) NOT NULL,
  quantity      INT UNSIGNED NOT NULL DEFAULT 1,
  line_total    DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  INDEX idx_order_items_order (order_id)
) ENGINE=InnoDB;

-- ===== COMMENTS =====

CREATE TABLE IF NOT EXISTS product_comments (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id    BIGINT UNSIGNED NOT NULL,
  name          VARCHAR(100) NOT NULL,
  rating        TINYINT UNSIGNED NULL,
  comment_text  TEXT NOT NULL,
  ip_address    VARCHAR(45) NULL,
  is_visible    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_comments_product (product_id)
) ENGINE=InnoDB;

-- ===== LEADS / INQUIRIES =====

CREATE TABLE IF NOT EXISTS bulk_order_inquiries (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(150) NOT NULL,
  company_name      VARCHAR(150) NULL,
  phone             VARCHAR(15) NOT NULL,
  email             VARCHAR(150) NULL,
  category_interest VARCHAR(150) NULL,
  estimated_qty     VARCHAR(50) NULL,
  message           TEXT NULL,
  status            ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_bulk_status_created (status, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS custom_order_inquiries (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  phone           VARCHAR(15) NOT NULL,
  email           VARCHAR(150) NULL,
  description     TEXT NOT NULL,
  reference_image VARCHAR(255) NULL,
  status          ENUM('new','in_discussion','quoted','closed') NOT NULL DEFAULT 'new',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_custom_status_created (status, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS newsletter_signups (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(150) NOT NULL UNIQUE,
  phone         VARCHAR(15) NULL,
  source        VARCHAR(50) NULL DEFAULT 'homepage_banner',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===== MISC CONTENT =====

CREATE TABLE IF NOT EXISTS community_posts (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(200) NULL,
  image_path    VARCHAR(255) NOT NULL,
  caption       TEXT NULL,
  customer_name VARCHAR(150) NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS faq_items (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question      VARCHAR(300) NOT NULL,
  answer        TEXT NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
