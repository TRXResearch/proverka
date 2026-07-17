// =============================================
// НОВОСТНОЙ СЛАЙДЕР
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

    // Клик по точкам
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
    });

    // Автопрокрутка каждые 6 секунд
    let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 6000);

    // Остановка автопрокрутки при наведении
    const slider = document.querySelector('.news__slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
        slider.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => goToSlide(currentSlide + 1), 6000);
        });
    }

    // Переключение по свайпу (для телефонов)
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
// ВКЛАДКИ КАЛЬКУЛЯТОРА
// =============================================
document.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Здесь можно добавить логику смены режима
        console.log(`Switched to: ${this.textContent}`);
    });
});

// =============================================
// КНОПКА "EXCHANGE NOW"
// =============================================
document.querySelector('.btn-submit')?.addEventListener('click', function(e) {
    e.preventDefault();
    
    const fromSelect = document.querySelector('.calc-row:first-child select');
    const toSelect = document.querySelector('.calc-row:last-child select');
    const fromInput = document.querySelector('.calc-row:first-child input');
    const toInput = document.querySelector('.calc-row:last-child input');
    
    alert(`✅ Exchange request!\n\nYou give: ${fromInput?.value || '1'} ${fromSelect?.value || 'BTC'}\nYou receive: ${toInput?.value || '95'} ${toSelect?.value || 'USDT'}\n\n⚠️ This is a demo version. Full functionality coming soon!`);
});

// =============================================
// ПЕРЕКЛЮЧЕНИЕ ТЕМЫ (ТЕМНАЯ/СВЕТЛАЯ)
// =============================================
document.querySelector('.theme-toggle')?.addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    this.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    
    // Сохраняем выбор пользователя
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
});

// Восстанавливаем тему при загрузке
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    document.querySelector('.theme-toggle').textContent = '☀️';
}

// =============================================
// ЛОГ ДЛЯ РАЗРАБОТЧИКА
// =============================================
console.log('🚀 ObmenAT777 ready!');
console.log('📌 Site structure:');
console.log('   ✅ Header with navigation');
console.log('   ✅ Intro with calculator');
console.log('   ✅ News slider (auto-play)');
console.log('   ✅ Content blocks');
console.log('   ✅ Footer');
console.log('   ✅ Responsive design');
console.log('   ✅ Dark/Light theme');
