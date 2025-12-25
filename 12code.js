(function () {
  "use strict";

  const targetUrls = [
    "https://s.shopee.vn/4fnUm7GK8q",
    "https://s.shopee.vn/1gABt6CIBu",
    "https://s.shopee.vn/8V0W1joWMM",
    "https://s.shopee.vn/7AV8RPYu6F",
  ];

  const images = [
    "https://i45.servimg.com/u/f45/19/58/16/37/facebo10.jpg",
    "https://i45.servimg.com/u/f45/19/58/16/37/no_mar23.png",
    "https://i45.servimg.com/u/f45/19/58/16/37/no_mar24.png",
    "https://i45.servimg.com/u/f45/19/58/16/37/no_mar25.png",
  ];

  const delayMinutes = 2;
  const storageKey = "bannerClosedTime";

  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  // Safe localStorage helpers
  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, val) {
      try {
        localStorage.setItem(key, val);
      } catch {
        // ignore
      }
    },
  };

  const lastClosed = storage.get(storageKey);
  const now = Date.now();
  const delayMs = delayMinutes * 60 * 1000;
  if (lastClosed && now - parseInt(lastClosed, 10) < delayMs) return;

  const randomImage = pick(images);
  const randomLink = pick(targetUrls);

  // Ensure DOM ready (an toàn nếu script chạy ở <head>)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  function init() {
    // Inject CSS once
    const styleId = "promo-overlay-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .promo-overlay{
          position:fixed; inset:0;
          width:100vw; height:100vh;
          display:flex; align-items:center; justify-content:center;
          background:rgba(0,0,0,.35);
          z-index:9998;
          touch-action:manipulation;
        }
        .promo-banner{
          position:relative;
          width:300px; height:200px;
          background:#fff;
          border:3px solid #000;
          border-radius:10px;
          overflow:hidden;
          box-shadow:0 4px 12px rgba(0,0,0,.2);
          z-index:9999;
        }
        .promo-img{
          width:100%; height:100%;
          object-fit:cover;
          display:block;
          cursor:pointer;
          user-select:none;
          -webkit-user-drag:none;
        }
        .promo-close{
          position:absolute; top:8px; right:8px;
          width:42px; height:42px;
          border-radius:50%;
          border:0;
          background:rgba(0,0,0,.55);
          color:#fff;
          font-size:30px;
          line-height:42px;
          text-align:center;
          cursor:pointer;
          padding:0;
          z-index:10000;
          user-select:none;
        }
        .promo-close:focus-visible{
          outline:2px solid #fff;
          outline-offset:2px;
        }
        @media (prefers-reduced-motion: reduce){
          .promo-overlay, .promo-banner{ scroll-behavior:auto; }
        }
      `;
      document.head.appendChild(style);
    }

    const overlay = document.createElement("div");
    overlay.className = "promo-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    const banner = document.createElement("div");
    banner.className = "promo-banner";

    const img = document.createElement("img");
    img.className = "promo-img";
    img.src = randomImage;
    img.alt = "Khuyến mãi";
    img.loading = "eager";
    img.decoding = "async";

    const close = document.createElement("button");
    close.className = "promo-close";
    close.type = "button";
    close.innerHTML = "&times;";
    close.setAttribute("aria-label", "Đóng");

    banner.append(img, close);
    overlay.appendChild(banner);
    document.body.appendChild(overlay);

    let removed = false;

    const removeAll = () => {
      if (removed) return;
      removed = true;

      // cleanup listeners
      img.removeEventListener("pointerdown", onImg);
      close.removeEventListener("pointerdown", onClose);
      overlay.removeEventListener("pointerdown", onOverlay);
      banner.removeEventListener("pointerdown", stop);
      document.removeEventListener("keydown", onEsc);

      overlay.remove();
    };

    const stop = (e) => e.stopPropagation();

    const onImg = (e) => {
      e.stopPropagation();

      // bấm hình -> tính 2 phút
      storage.set(storageKey, String(Date.now()));

      // mở link (user gesture)
      const a = document.createElement("a");
      a.href = randomLink;
      a.target = "_blank";
      a.rel = "noopener noreferrer nofollow";
      a.click();

      removeAll();
    };

    const onClose = (e) => {
      e.stopPropagation();
      // bấm X -> tính 2 phút
      storage.set(storageKey, String(Date.now()));
      removeAll();
    };

    const onOverlay = () => {
      // bấm ngoài banner: chỉ tắt QC, KHÔNG tính 2 phút
      removeAll();
    };

    const onEsc = (e) => {
      if (e.key === "Escape") {
        // ESC coi như tắt ngoài (không tính 2 phút)
        removeAll();
      }
    };

    // pointerdown cho mobile “nhạy” hơn click
    img.addEventListener("pointerdown", onImg, { passive: true });
    close.addEventListener("pointerdown", onClose, { passive: true });
    overlay.addEventListener("pointerdown", onOverlay, { passive: true });
    banner.addEventListener("pointerdown", stop, { passive: true });
    document.addEventListener("keydown", onEsc);

    // optional: focus vào nút đóng cho accessibility
    close.focus({ preventScroll: true });
  }
})();
