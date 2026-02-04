-- Init DB for Hakan Karsak Akademi
-- 1. users (admin)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. instructors
CREATE TABLE IF NOT EXISTS instructors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  photo VARCHAR(255),
  expertise VARCHAR(255),
  social_links JSONB DEFAULT '{}',
  intro_video VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  seo_meta JSONB DEFAULT '{"title": "", "description": "", "keywords": "", "og_image": ""}',
  display_order INTEGER DEFAULT 999,
  show_on_homepage BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_instructors_slug ON instructors(slug);
CREATE INDEX IF NOT EXISTS idx_instructors_display_order ON instructors(display_order);

-- 3. events
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  location VARCHAR(255),
  duration_info VARCHAR(100),
  capacity INTEGER,
  poster_image VARCHAR(255),
  gallery JSONB DEFAULT '{"photos": [], "videos": []}',
  slug VARCHAR(255) UNIQUE NOT NULL,
  seo_meta JSONB DEFAULT '{"title": "", "description": "", "keywords": "", "og_image": ""}',
  is_featured BOOLEAN DEFAULT false,
  featured_priority INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 999,
  show_on_homepage BOOLEAN DEFAULT false,
  show_in_hero BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_modified TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured, featured_priority);
CREATE INDEX IF NOT EXISTS idx_events_display_order ON events(display_order);

-- 4. event_instructors
CREATE TABLE IF NOT EXISTS event_instructors (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  role VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, instructor_id)
);
CREATE INDEX IF NOT EXISTS idx_event_instructors_event ON event_instructors(event_id);
CREATE INDEX IF NOT EXISTS idx_event_instructors_instructor ON event_instructors(instructor_id);

-- 5. applications
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  event_title VARCHAR(255),
  event_date TIMESTAMP,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_applications_event ON applications(event_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at);

-- 6. site_settings
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO site_settings (key, value) VALUES
('site_title', 'Hakan Karsak Akademi'),
('site_description', 'Sanat ve kültür etkinlikleri'),
('google_analytics_id', ''),
('google_tag_manager_id', ''),
('facebook_pixel_id', ''),
('meta_verification', ''),
('google_site_verification', ''),
('canonical_domain', 'https://hakankarsak.com'),
('robots_txt_custom', ''),
('structured_data_organization', '{}'),
('contact_email', 'info@hakankarsak.com'),
('contact_phone', ''),
('address', ''),
('social_facebook', ''),
('social_instagram', ''),
('social_twitter', ''),
('social_youtube', '')
ON CONFLICT (key) DO NOTHING;

-- 7. redirects
CREATE TABLE IF NOT EXISTS redirects (
  id SERIAL PRIMARY KEY,
  from_path VARCHAR(500) UNIQUE NOT NULL,
  to_path VARCHAR(500) NOT NULL,
  status_code INTEGER DEFAULT 301,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_redirects_from ON redirects(from_path);

-- 8. sitemap_cache
CREATE TABLE IF NOT EXISTS sitemap_cache (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW()
);

-- 9. page_meta
CREATE TABLE IF NOT EXISTS page_meta (
  page_path VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  keywords VARCHAR(500),
  og_image VARCHAR(255),
  canonical_url VARCHAR(500),
  updated_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO page_meta (page_path, title, description) VALUES
('/', 'Ana Sayfa | Hakan Karsak Akademi', 'Sanat ve kültür etkinlikleri'),
('/hakkimizda', 'Hakkımızda | Hakan Karsak Akademi', 'Hakan Karsak Akademi hakkında bilgi'),
('/iletisim', 'İletişim | Hakan Karsak Akademi', 'Bizimle iletişime geçin'),
('/etkinlikler', 'Etkinlikler | Hakan Karsak Akademi', 'Yaklaşan ve geçmiş etkinliklerimiz'),
('/egitmenler', 'Eğitmenler | Hakan Karsak Akademi', 'Eğitmen kadromuz'),
('/arsiv', 'Arşiv | Hakan Karsak Akademi', 'Geçmiş etkinlik arşivi'),
('/sss', 'Sıkça Sorulan Sorular | Hakan Karsak Akademi', 'Merak ettikleriniz')
ON CONFLICT (page_path) DO NOTHING;

-- 10. faqs
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(order_index);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active);
