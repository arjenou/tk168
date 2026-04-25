-- Seed LATEST JOURNAL with the same copy as legacy home `news` in js/data.js (3 items).
-- Idempotent: replaces fixed seed ids.
DELETE FROM journal_entries WHERE id IN ('nseed001', 'nseed002', 'nseed003');

INSERT INTO journal_entries (
  id, title_zh, title_ja, title_en,
  category_zh, category_ja, category_en,
  summary_zh, summary_ja, summary_en,
  body_zh, body_ja, body_en,
  image_r2_key, image_url, date_label, display_order, is_published
) VALUES
(
  'nseed001',
  '2026年最值得期待的超跑：性能进化与设计美学的再一次碰撞',
  '2026年注目のスーパーカー特集 性能進化とデザイン美学が再び交差する',
  '2026 supercars to watch: where performance evolution meets design again',
  '行业动态',
  'マーケット情報',
  'Market update',
  '从法拉利到布加迪，2026 年度最受关注的超跑阵容正在成形。TK168 为您提前梳理每一台车型背后的设计语言与性能看点……',
  'フェラーリからブガッティまで、2026年に注目されるスーパーカーの顔ぶれが見え始めています。TK168 が各モデルのデザイン言語と性能面の見どころを先に整理します。',
  'From Ferrari to Bugatti, the 2026 supercar line-up is starting to take shape. TK168 highlights the design language and performance points worth tracking in advance.',
  NULL, NULL, NULL,
  NULL,
  'assets/images/f3.webp',
  '2026 · 04 · 08',
  0,
  1
),
(
  'nseed002',
  '全新法拉利 SF90 Spider 正式入库',
  '新型 Ferrari SF90 Spider が正式入庫',
  'New Ferrari SF90 Spider officially added to stock',
  '新车到库',
  '新規入庫',
  'New arrival',
  NULL, NULL, NULL,
  NULL, NULL, NULL,
  NULL,
  'assets/images/f4.webp',
  '2026 · 03 · 28',
  1,
  1
),
(
  'nseed003',
  'TK168 × Monaco 慈善拍卖活动圆满落幕',
  'TK168 × Monaco チャリティーオークション開催レポート',
  'TK168 × Monaco charity auction event recap',
  '公司活动',
  'ブランドトピックス',
  'Brand story',
  NULL, NULL, NULL,
  NULL, NULL, NULL,
  NULL,
  'assets/images/f7.webp',
  '2026 · 03 · 12',
  2,
  1
);
