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
  const storageKey = "bannerClosedTime";

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* ignore */ }
  }

  function whenBodyReady(fn) {
    if (document.body) return fn();
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  }

  function showBanner() {
    // Tránh tạo 2 lần nếu script bị load lại
    if (document.getElementById("gocmod-banner-dialog")) return;

    const lastClosed = safeGet(storageKey);
    const now = Date.now();
    if (lastClosed) {
      const t = parseInt(lastClosed, 10);
      if (!Number.isNaN(t) && (now - t) < delayMinutes * 60 * 1000) return;
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const randomLink = targetUrls[Math.floor(Math.random() * targetUrls.length)];

    const banner = document.createElement("div");
    banner.id = "gocmod-banner-dialog";
    banner.style.position = "fixed";
    banner.style.top = "50%";
    banner.style.left = "50%";
    banner.style.transform = "translate(-50%, -50%)";
    banner.style.zIndex = "2147483647";
    banner.style.width = "300px";
    banner.style.height = "200px";
    banner.style.background = "#fff";
    banner.style.border = "3px solid #000";
    banner.style.borderRadius = "10px";
    banner.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
    banner.style.cursor = "pointer";
    banner.style.overflow = "hidden";

    const img = document.createElement("img");
    img.src = randomImage;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.display = "block";

    const close = document.createElement("span");
    close.innerHTML = "&times;";
    close.style.position = "absolute";
    close.style.top = "2px";
    close.style.right = "5px";
    close.style.width = "34px";
    close.style.height = "34px";
    close.style.lineHeight = "34px";
    close.style.textAlign = "center";
    close.style.fontSize = "40px";
    close.style.color = "#fff";
    close.style.cursor = "pointer";
    close.style.background = "rgba(0, 0, 0, 0.6)";
    close.style.borderRadius = "50%";
    close.style.zIndex = "2147483647";

    banner.appendChild(img);
    banner.appendChild(close);
    document.body.appendChild(banner);

    let bannerClosed = false;

    // Click banner (trừ nút X) -> mở link + tính time
    banner.addEventListener("click", function (e) {
      if (bannerClosed) return;
      if (e.target === close) return;

      // Mở tab mới: dùng window.open sẽ “rõ ràng” hơn linkElement.click() trên vài máy
      window.open(randomLink, "_blank", "noopener,noreferrer");

      safeSet(storageKey, Date.now().toString());
      banner.remove();
      bannerClosed = true;
    });

    // Click ngoài banner -> tắt QC (không tính time)
    document.addEventListener("click", function (event) {
      if (!bannerClosed && banner && !banner.contains(event.target)) {
        banner.remove();
        bannerClosed = true;
      }
    }, { passive: true });

    // Click X -> tắt QC + tính time
    close.addEventListener("click", function (e) {
      e.stopPropagation();
      safeSet(storageKey, Date.now().toString());
      banner.remove();
      bannerClosed = true;
    });
  }

  whenBodyReady(showBanner);
})();
