USE oxfox_studio;

-- Category quick-pick emoji (shown in admin category filter dropdown)
ALTER TABLE categories
  ADD COLUMN emoji VARCHAR(10) NULL AFTER banner_image;

-- Product merchandising fields
ALTER TABLE products
  ADD COLUMN mrp DECIMAL(10,2) NULL AFTER price,
  ADD COLUMN badge ENUM('none','new','bestseller','sale','limited') NOT NULL DEFAULT 'none' AFTER mrp,
  ADD COLUMN filter_tag VARCHAR(100) NULL AFTER badge,
  ADD COLUMN emoji_icon VARCHAR(10) NULL AFTER filter_tag;

-- Quantity-based discount tiers, e.g. "min 2 units -> 20% off"
CREATE TABLE IF NOT EXISTS product_discount_tiers (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id        BIGINT UNSIGNED NOT NULL,
  min_qty           INT UNSIGNED NOT NULL,
  discount_percent  DECIMAL(5,2) NOT NULL,
  sort_order        INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_discount_tiers_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_discount_tiers_product (product_id)
) ENGINE=InnoDB;
