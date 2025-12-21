(function () {
    const targetUrls = [
        "https://s.shopee.vn/4fnUm7GK8q",
        "https://s.shopee.vn/1gABt6CIBu",
        "https://s.shopee.vn/8V0W1joWMM",
        "https://s.shopee.vn/7AV8RPYu6F"
    ];
    const images = [
        "https://i45.servimg.com/u/f45/19/58/16/37/facebo10.jpg",
        "https://i45.servimg.com/u/f45/19/58/16/37/no_mar23.png",
        "https://i45.servimg.com/u/f45/19/58/16/37/no_mar24.png",
        "https://i45.servimg.com/u/f45/19/58/16/37/no_mar25.png"
    ];

    const delayMinutes = 2;
    const storageKey = 'bannerClosedTime';

    const lastClosed = localStorage.getItem(storageKey);
    const now = Date.now();
    if (lastClosed && now - parseInt(lastClosed) < delayMinutes * 60 * 1000) {
        return;
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const randomLink = targetUrls[Math.floor(Math.random() * targetUrls.length)];

    const banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.top = '50%';
    banner.style.left = '50%';
    banner.style.transform = 'translate(-50%, -50%)';
    banner.style.zIndex = '9999';
    banner.style.width = '300px';
    banner.style.height = '200px';
    banner.style.background = '#fff';
    banner.style.border = '3px solid #000';
    banner.style.borderRadius = '10px';
    banner.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    banner.style.cursor = 'pointer';
    banner.style.overflow = 'hidden';

    const img = document.createElement('img');
    img.src = randomImage;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.display = 'block';

    const close = document.createElement('span');
    close.innerHTML = '&times;';
    close.style.position = 'absolute';
    close.style.top = '5px';
    close.style.right = '10px';
    close.style.fontSize = '24px';
    close.style.color = '#888';
    close.style.cursor = 'pointer';
    close.style.zIndex = '10000';

    banner.appendChild(img);
    banner.appendChild(close);
    document.body.appendChild(banner);

    let bannerClosed = false;

    // Click trong banner -> mở Shopee
    banner.addEventListener('click', function (e) {
        if (e.target === close || bannerClosed) return;

        const linkElement = document.createElement('a');
        linkElement.href = randomLink;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer nofollow';
        linkElement.click();

        localStorage.setItem(storageKey, Date.now().toString());
        banner.remove();
        bannerClosed = true;
    });

    // Click ngoài banner -> chỉ tắt QC
    document.addEventListener('click', function (event) {
        if (!banner.contains(event.target) && !bannerClosed) {
            localStorage.setItem(storageKey, Date.now().toString());
            banner.remove();
            bannerClosed = true;
        }
    });

    // Click nút X -> tắt QC
    close.addEventListener('click', function (e) {
        e.stopPropagation();
        localStorage.setItem(storageKey, Date.now().toString());
        banner.remove();
        bannerClosed = true;
    });
})();
