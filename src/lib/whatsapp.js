// Opens a WhatsApp chat with a prefilled message.
// Uses same-tab navigation instead of window.open(_blank): in-app browsers
// (Instagram, Facebook, TikTok) and some Android browsers silently block new tabs.
// `onOpened` runs only once the page is actually left (WhatsApp took over).
export function openWhatsApp(phone, text, onOpened) {
    if (onOpened) {
        const done = () => {
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('pagehide', done);
            onOpened();
        };
        const onVisibility = () => {
            if (document.visibilityState === 'hidden') done();
        };
        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('pagehide', done);
    }
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
