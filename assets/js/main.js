import { initNavigation } from './navigation.js';
import { initFaq } from './faq.js';
import { initHeader } from './header.js';
import { initMotion } from './motion.js';

for (const initialize of [initNavigation, initFaq, initHeader, initMotion]) {
  try { initialize(); } catch (error) { console.error('初期化に失敗しました:', error); }
}
