// =============================================
// 1. НОВОСТНОЙ СЛАЙДЕР
// =============================================
(function() {
    const track = document.getElementById('newsTrack');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = dots.length;
    
    if (!track || !dots.length) return;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
    });

    let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 6000);

    const slider = document.querySelector('.news__slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
        slider.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => goToSlide(currentSlide + 1), 6000);
        });
    }

    // Свайп для телефонов
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(currentSlide + 1);
            else goToSlide(currentSlide - 1);
        }
    });
})();

// =============================================
// 2. ВКЛАДКИ КАЛЬКУЛЯТОРА
// =============================================
document.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        console.log(`📊 Switched to: ${this.textContent}`);
    });
});

// =============================================
// 3. КАЛЬКУЛЯТОР — РАСЧЕТ КУРСА
// =============================================
const fromAmount = document.getElementById('fromAmount');
const toAmount = document.getElementById('toAmount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');

// Фейковые курсы для демонстрации
const rates = {
    'BTC_USDT': 95000,
    'ETH_USDT': 3200,
    'USDT_USDT': 1,
    'BNB_USDT': 580,
    'SOL_USDT': 140,
};

function getRate(from, to) {
    // Если оба USDT или валюта к самой себе
    if (from === to) return 1;
    if (from === 'USDT' && to === 'USDT') return 1;
    
    const key = `${from}_${to}`;
    if (rates[key]) return rates[key];
    
    // Обратное преобразование
    const reverseKey = `${to}_${from}`;
    if (rates[reverseKey]) return 1 / rates[reverseKey];
    
    return 1.0; // fallback
}

function updateCalculator() {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amount = parseFloat(fromAmount.value) || 0;
    
    const rate = getRate(from, to);
    const result = amount * rate;
    
    // Форматируем в зависимости от валюты
    const decimals = (to === 'USDT' || to === 'BTC' || to === 'ETH') ? 2 : 2;
    toAmount.value = result.toFixed(decimals);
}

fromAmount.addEventListener('input', updateCalculator);
fromCurrency.addEventListener('change', updateCalculator);
toCurrency.addEventListener('change', updateCalculator);

// Инициализация
updateCalculator();

// =============================================
// 4. КНОПКА "EXCHANGE NOW"
// =============================================
document.getElementById('exchangeBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const fromVal = fromCurrency.options[fromCurrency.selectedIndex].text;
    const toVal = toCurrency.options[toCurrency.selectedIndex].text;
    const fromAmt = fromAmount.value || '0';
    const toAmt = toAmount.value || '0';
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1a1f2e;
        padding: 30px 40px;
        border-radius: 16px;
        border: 1px solid #FFCA0E;
        z-index: 1000;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.8);
        animation: fadeIn 0.3s ease;
    `;
    
    popup.innerHTML = `
        <h2 style="color: #FFCA0E; margin-bottom: 16px;">✅ Exchange Request</h2>
        <p style="color: #eee; font-size: 18px; margin-bottom: 8px;">
            You give: <strong style="color: #fff;">${fromAmt} ${fromVal}</strong>
        </p>
        <p style="color: #eee; font-size: 18px; margin-bottom: 20px;">
            You receive: <strong style="color: #FFCA0E;">${toAmt} ${toVal}</strong>
        </p>
        <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-bottom: 20px;">
            ⚠️ This is a demo version.<br>Full functionality coming soon!
        </p>
        <button onclick="this.parentElement.remove()" style="
            background: #FFCA0E;
            color: #000;
            border: none;
            padding: 12px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
        ">Close</button>
    `;
    
    document.body.appendChild(popup);
    
    // Закрытие по клику вне окна
    popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.remove();
    });
});

// Стили для анимации
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -40%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
    }
`;
document.head.appendChild(styleSheet);

// =============================================
// 5. ТЕМНАЯ/СВЕТЛАЯ ТЕМА
// =============================================
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    this.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
});

// Восстанавливаем тему
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = '☀️';
}

// =============================================
// 6. СВЕТЛАЯ ТЕМА — ДОПОЛНИТЕЛЬНЫЕ СТИЛИ
// =============================================
const lightStyles = document.createElement('style');
lightStyles.textContent = `
    body.light-theme {
        background: #f5f7fa;
        color: #1a1a2e;
    }
    body.light-theme .header {
        background: rgba(255, 255, 255, 0.92);
        border-bottom-color: rgba(0,0,0,0.05);
    }
    body.light-theme .nav a {
        color: rgba(0,0,0,0.6);
    }
    body.light-theme .nav a:hover {
        color: #FFCA0E;
    }
    body.light-theme .intro__subtitle {
        color: rgba(0,0,0,0.6);
    }
    body.light-theme .calculator {
        background: rgba(255,255,255,0.9);
        border-color: rgba(0,0,0,0.08);
    }
    body.light-theme .calc-input-group {
        background: rgba(0,0,0,0.04);
        border-color: rgba(0,0,0,0.08);
    }
    body.light-theme .calc-input-group select {
        color: #1a1a2e;
    }
    body.light-theme .calc-input-group input {
        color: #1a1a2e;
    }
    body.light-theme .calc-tab {
        color: rgba(0,0,0,0.4);
    }
    body.light-theme .calc-tab.active {
        color: #000;
    }
    body.light-theme .calc__info {
        color: rgba(0,0,0,0.4);
    }
    body.light-theme .btn-dark {
        background: rgba(0,0,0,0.06);
        border-color: rgba(0,0,0,0.1);
        color: #1a1a2e;
    }
    body.light-theme .btn-dark:hover {
        background: rgba(0,0,0,0.12);
    }
    body.light-theme .news__item {
        background: rgba(0,0,0,0.03);
    }
    body.light-theme .news__title {
        color: #1a1a2e;
    }
    body.light-theme .section-title {
        color: #1a1a2e;
    }
    body.light-theme .content p {
        color: rgba(0,0,0,0.7);
    }
    body.light-theme .content ul li {
        color: rgba(0,0,0,0.65);
    }
    body.light-theme .footer {
        border-top-color: rgba(0,0,0,0.05);
    }
    body.light-theme .footer__inner {
        color: rgba(0,0,0,0.3);
    }
    body.light-theme .dot {
        background: #ccc;
    }
    body.light-theme .dot.active {
        background: #FFCA0E;
    }
    body.light-theme .lang-switcher a {
        color: rgba(0,0,0,0.4);
    }
    body.light-theme .lang-switcher a.active {
        color: #FFCA0E;
    }
    body.light-theme .calc-input-group select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='black' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    }
    body.light-theme .calc-arrow {
        opacity: 0.4;
    }
`;
document.head.appendChild(lightStyles);

// =============================================
// 7. ЛОГ ЗАПУСКА
// =============================================
console.log('🚀 ObmenAT777 ready!');
console.log('📌 Features:');
console.log('   ✅ Header with navigation');
console.log('   ✅ Intro with calculator & video background');
console.log('   ✅ News slider (auto-play)');
console.log('   ✅ Live currency rates (demo)');
console.log('   ✅ Dark/Light theme');
console.log('   ✅ Fully responsive');
console.log('   ✅ Exchange popup');
