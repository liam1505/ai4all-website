// === State ===
let activeTag = null;

// === Mobile Menu Toggle ===
document.querySelector('.mobile-menu')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// === Render Tag Filters ===
function renderTagFilters() {
    const container = document.getElementById('tag-filters');
    if (!container) return;

    // Collect only tags that exist in posts
    const usedTags = new Set();
    POSTS.forEach(post => post.tags?.forEach(tag => usedTags.add(tag)));

    let html = `<button class="tag-btn active" data-tag="all">הכל</button>`;
    
    Object.entries(TAGS).forEach(([key, tag]) => {
        if (usedTags.has(key)) {
            html += `<button class="tag-btn" data-tag="${key}">${tag.icon} ${tag.label}</button>`;
        }
    });

    container.innerHTML = html;

    // Add click handlers
    container.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTag = btn.dataset.tag === 'all' ? null : btn.dataset.tag;
            renderPosts();
        });
    });
}

// === Render Posts ===
function renderPosts() {
    const grid = document.getElementById('posts-grid');
    if (!grid) return;

    const filtered = activeTag 
        ? POSTS.filter(post => post.tags?.includes(activeTag))
        : POSTS;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="emoji">🚀</div>
                <p>תוכן חדש בדרך... חזרו בקרוב!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(post => {
        const tagsHtml = (post.tags || [])
            .map(tag => TAGS[tag] ? `<span class="post-tag">${TAGS[tag].icon} ${TAGS[tag].label}</span>` : '')
            .join('');

        return `
            <a href="post.html?id=${post.id}" class="post-card">
                <div class="post-date">${post.dateHe}</div>
                <div class="post-title">${post.title}</div>
                <div class="post-tags">${tagsHtml}</div>
                <div class="post-excerpt">${post.excerpt}</div>
                <span class="read-more">להמשך קריאה ←</span>
            </a>
        `;
    }).join('');
}

// === Render Single Post ===
function renderPost() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    const post = POSTS.find(p => p.id === postId);

    const container = document.getElementById('post-container');
    if (!container) return;

    if (!post) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="emoji">🤔</div>
                <p>הפוסט לא נמצא</p>
                <a href="/" class="back-link">→ חזרה לדף הבית</a>
            </div>
        `;
        return;
    }

    // Tags HTML
    const tagsHtml = (post.tags || [])
        .map(tag => TAGS[tag] ? `<span class="post-tag">${TAGS[tag].icon} ${TAGS[tag].label}</span>` : '')
        .join('');

    // Convert line breaks to paragraphs
    const bodyHtml = post.body
        .split('\n\n')
        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
        .join('');

    container.innerHTML = `
        <div class="post-header">
            <div class="post-date">${post.dateHe}</div>
            <h1 class="post-title">${post.title}</h1>
            <div class="post-tags">${tagsHtml}</div>
        </div>
        <div class="post-body">
            ${bodyHtml}
        </div>
        <a href="/" class="back-link">→ חזרה לדף הבית</a>
    `;

    document.title = post.title + ' | AI4ALL';
}

// === Init ===
document.addEventListener('DOMContentLoaded', () => {
    renderTagFilters();
    renderPosts();
    renderPost();
});
