/**
 * TalkingScientist Theme
 * Main JavaScript
 */

(function() {
    'use strict';

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';

    function setTheme(theme) {
        if (theme === 'dark') {
            body.classList.remove('theme-light');
            body.classList.add('theme-dark');
        } else if (theme === 'light') {
            body.classList.remove('theme-dark');
            body.classList.add('theme-light');
        }
        localStorage.setItem('theme', theme);
    }

    // Apply saved theme (always apply, default is dark)
    setTheme(currentTheme);

    // Toggle theme
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const currentTheme = localStorage.getItem('theme') || 'dark';
            let newTheme;

            if (currentTheme === 'dark') {
                newTheme = 'light';
            } else {
                newTheme = 'dark';
            }

            setTheme(newTheme);
        });
    }

    // Command Palette
    const commandPalette = document.getElementById('commandPalette');
    const commandPaletteOverlay = document.getElementById('commandPaletteOverlay');
    const commandPaletteInput = document.getElementById('commandPaletteInput');
    const commandPaletteResults = document.getElementById('commandPaletteResults');

    let selectedIndex = 0;
    let searchResults = [];
    let searchTimeout;

    function openCommandPalette() {
        if (commandPalette && commandPaletteOverlay) {
            commandPalette.classList.add('active');
            commandPaletteOverlay.classList.add('active');
            commandPaletteInput.focus();
        }
    }

    function closeCommandPalette() {
        if (commandPalette && commandPaletteOverlay) {
            commandPalette.classList.remove('active');
            commandPaletteOverlay.classList.remove('active');
            commandPaletteInput.value = '';
            commandPaletteResults.innerHTML = '';
            selectedIndex = 0;
            searchResults = [];
        }
    }

    function performSearch(query) {
        if (!query || query.length < 2) {
            commandPaletteResults.innerHTML = '<div class="command-palette-item text-muted">Type to search posts...</div>';
            return;
        }

        commandPaletteResults.innerHTML = '<div class="command-palette-item text-muted">Searching...</div>';

        // Use WordPress AJAX
        const formData = new FormData();
        formData.append('action', 'talkingscientist_search');
        formData.append('query', query);

        fetch(talkingScientistData.ajaxUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data.length > 0) {
                searchResults = data.data;
                renderResults(searchResults);
            } else {
                commandPaletteResults.innerHTML = '<div class="command-palette-item text-muted">No results found</div>';
                searchResults = [];
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            commandPaletteResults.innerHTML = '<div class="command-palette-item text-muted">Search failed</div>';
        });
    }

    function renderResults(results) {
        commandPaletteResults.innerHTML = '';
        results.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = 'command-palette-item';
            if (index === selectedIndex) {
                item.classList.add('selected');
            }

            const typeLabel = result.type === 'lab_note' ? 'Lab Note' : 'Dispatch';
            item.innerHTML = `
                <div class="result-title">${result.title}</div>
                <div class="text-small text-muted">
                    <span class="tag">${typeLabel}</span>
                    ${result.excerpt ? result.excerpt.substring(0, 100) + '...' : ''}
                </div>
            `;

            item.addEventListener('click', function() {
                window.location.href = result.url;
            });

            commandPaletteResults.appendChild(item);
        });
    }

    function updateSelection() {
        const items = commandPaletteResults.querySelectorAll('.command-palette-item');
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Cmd/Ctrl + K to open command palette
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openCommandPalette();
        }

        // Escape to close
        if (e.key === 'Escape' && commandPalette.classList.contains('active')) {
            closeCommandPalette();
        }

        // Arrow keys for navigation
        if (commandPalette.classList.contains('active') && searchResults.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, searchResults.length - 1);
                updateSelection();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                updateSelection();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (searchResults[selectedIndex]) {
                    window.location.href = searchResults[selectedIndex].url;
                }
            }
        }
    });

    // Search input
    if (commandPaletteInput) {
        commandPaletteInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            selectedIndex = 0;

            searchTimeout = setTimeout(function() {
                performSearch(e.target.value);
            }, 300);
        });
    }

    // Close on overlay click
    if (commandPaletteOverlay) {
        commandPaletteOverlay.addEventListener('click', function() {
            closeCommandPalette();
        });
    }

    // Archive year toggle
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('archive-year')) {
            e.preventDefault();
            const button = e.target;
            const monthsDiv = button.nextElementSibling;

            if (monthsDiv && monthsDiv.classList.contains('archive-months')) {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';

                button.setAttribute('aria-expanded', !isExpanded);

                if (isExpanded) {
                    monthsDiv.style.display = 'none';
                } else {
                    monthsDiv.style.display = 'block';
                }
            }
        }
    });

    // Copy code blocks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-code-button')) {
            e.preventDefault();
            const codeBlock = e.target.previousElementSibling;
            if (codeBlock && codeBlock.tagName === 'PRE') {
                const code = codeBlock.textContent;
                navigator.clipboard.writeText(code).then(function() {
                    e.target.textContent = 'Copied!';
                    setTimeout(function() {
                        e.target.textContent = 'Copy';
                    }, 2000);
                });
            }
        }
    });

    // Add copy buttons to code blocks
    document.querySelectorAll('pre').forEach(function(pre) {
        if (!pre.querySelector('.copy-code-button')) {
            const button = document.createElement('button');
            button.className = 'copy-code-button';
            button.textContent = 'Copy';
            button.setAttribute('aria-label', 'Copy code to clipboard');
            pre.parentNode.insertBefore(button, pre.nextSibling);
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#0') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.scrollBehavior = 'auto';
    }

})();
