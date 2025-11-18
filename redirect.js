if (location.hostname.includes("open.spotify.com")) {

    const observerSpotify = new MutationObserver(() => {

        const title = document.querySelector('span[data-testid="entityTitle"] h1')?.textContent;
        const artist = document.querySelector('a[data-testid="creator-link"]')?.textContent;

        if (title && artist) {
            observerSpotify.disconnect();
            sessionStorage.setItem("fromSpotify", JSON.stringify({ title, artist }));
            window.location.replace("https://music.youtube.com/search?q=" + encodeURIComponent(title + " " + artist));
        } else {
            window.alert("title or artist broke (sent by spotify-to-ytm extension)");
        }

    });

    observerSpotify.observe(document.body, { childList: true, subtree: true });
}

if (location.hostname.includes("music.youtube.com")) {
    const data = JSON.parse(sessionStorage.getItem("fromSpotify") || "null");
    if (!data) return;

    const observerYTM = new MutationObserver(() => {
        const link = document.querySelector('div.main-card-container.style-scope.ytmusic-card-shelf-renderer a[spellcheck="false"]')?.getAttribute("href");
        if (link) {
            observerYTM.disconnect();
            sessionStorage.removeItem("fromSpotify");
            window.location.replace(link);
        } else {
            window.alert("could not obtain link (sent by spotify-to-ytm extension)");
        }
    });

    observerYTM.observe(document.body, { childList: true, subtree: true });
}
