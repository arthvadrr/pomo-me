(() => {
    document
        .getElementById('settings-toggle')
        .addEventListener('click', (e) => {
            const toggled = e.currentTarget.getAttribute('aria-expanded');
            const dataTarget = e.currentTarget.getAttribute('data-target');
            const $target = document.getElementById(dataTarget);

            if (toggled === 'false') {
                e.currentTarget.setAttribute('aria-expanded', 'true');
                $target.classList.add('shown');
                $target.classList.remove('hidden');
                $target.focus();
            } else {
                e.currentTarget.setAttribute('aria-expanded', 'false');
                $target.classList.add('hidden');
                $target.classList.remove('shown');
            }
        });
})();
