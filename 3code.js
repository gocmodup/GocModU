(function () {
  // Nếu JS bị tắt thì đoạn này không chạy được (không có cách "tự xử" trong JS).
  // Nhưng ta sẽ đảm bảo: chỉ mở link khi banner HIỂN THỊ + click CHỦ ĐÍCH.

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
  const imageLoadTimeoutMs = 5000; // ảnh không load trong 5s => hủy

  try {
    const lastClosed = localStorage.getItem(storageKey);
    const now = Date.now();
    if (lastClosed && now - parseInt(lastClosed, 10) < delayMinutes * 60 * 1000) return;
  } catch (_) {
    // localStorage có thể bị chặn => bỏ qua cơ chế delay
  }

  // DOM chưa sẵn sàng thì chờ
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", () => arguments.callee(), { once: true });
    return;
  }

  const randomImage = images[Math.floor(Math.random() * images.length)];
  const randomLink = targetUrls[Math.floor(Math.random() * targetUrls.length)];

  // Overlay để giảm click nhầm nền
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.45)";
  overlay.style.zIndex = "9998";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";

  const banner = document.createElement("div");
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Promotion");
  banner.style.position = "relative";
  banner.style.zIndex = "9999";
  banner.style.width = "300px";
  banner.style.height = "200px";
  banner.style.background = "#fff";
  banner.style.border = "3px solid #000";
  banner.style.borderRadius = "10px";
  banner.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
  banner.style.overflow = "hidden";
  banner.style.userSelect = "none";

  const img = document.createElement("img");
  img.src = randomImage;
  img.alt = "Promotion";
  img.decoding = "async";
  img.loading = "eager";
  img.referrerPolicy = "no-referrer";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.display = "block";
  img.style.cursor = "pointer";

  const close = document.createElement("button");
  close.type = "button";
  close.innerHTML = "&times;";
  close.setAttribute("aria-label", "Close");
  close.style.position = "absolute";
  close.style.top = "6px";
  close.style.right = "10px";
  close.style.width = "32px";
  close.style.height = "32px";
  close.style.border = "none";
  close.style.borderRadius = "999px";
  close.style.background = "rgba(255,255,255,0.85)";
  close.style.fontSize = "24px";
  close.style.lineHeight = "28px";
  close.style.color = "#444";
  close.style.cursor = "pointer";
  close.style.zIndex = "10000";

  // (Tuỳ chọn) CTA rõ ràng để tránh clickbait
  const cta = document.createElement("div");
  cta.textContent = "Xem ưu đãi";
  cta.style.position = "absolute";
  cta.style.left = "10px";
  cta.style.bottom = "10px";
  cta.style.padding = "8px 12px";
  cta.style.background = "rgba(0,0,0,0.70)";
  cta.style.color = "#fff";
  cta.style.borderRadius = "8px";
  cta.style.fontSize = "14px";
  cta.style.cursor = "pointer";
  cta.style.zIndex = "10000";

  banner.appendChild(img);
  banner.appendChild(close);
  banner.appendChild(cta);
  overlay.appendChild(banner);
  document.body.appendChild(overlay);

  let destroyed = false;
  let imageOk = false;

  function destroy(setCooldown) {
    if (destroyed) return;
    destroyed = true;
    if (setCooldown) {
      try {
        localStorage.setItem(storageKey, Date.now().toString());
      } catch (_) {}
    }
    overlay.remove();
  }

  // Nếu click ra ngoài banner => chỉ đóng (KHÔNG mở link)
  overlay.addEventListener("click", (e) => {
    if (!banner.contains(e.target)) destroy(true);
  });

  close.addEventListener("click", (e) => {
    e.stopPropagation();
    destroy(true);
  });

  // Chỉ mở link khi click CHỦ ĐÍCH vào banner (img/cta)
  function safeOpenLink(e) {
    e.stopPropagation();

    // Nếu banner/ảnh không hiển thị được => bỏ qua (không mở)
    if (destroyed) return;
    if (!imageOk) return;

    // Kiểm tra banner có đang hiển thị thật không (phòng trường hợp bị CSS/adblock làm invisible)
    const rect = banner.getBoundingClientRect();
    const visible =
      rect.width > 0 &&
      rect.height > 0 &&
      window.getComputedStyle(banner).display !== "none" &&
      window.getComputedStyle(banner).visibility !== "hidden" &&
      window.getComputedStyle(banner).opacity !== "0";

    if (!visible) return;

    // Mở tab mới chỉ trong hành động click của user (tránh bị trình duyệt chặn popup)
    try {
      const newWin = window.open(randomLink, "_blank", "noopener,noreferrer");
      // Nếu bị chặn popup thì thôi, không làm gì thêm
      if (!newWin) return;
    } catch (_) {
      return;
    } finally {
      destroy(true);
    }
  }

  img.addEventListener("click", safeOpenLink);
  cta.addEventListener("click", safeOpenLink);

  // Ảnh load OK => mới cho phép click mở link
  const loadTimer = setTimeout(() => {
    // Ảnh không load kịp (có thể bị chặn) => huỷ banner, không mở link
    if (!imageOk) destroy(false);
  }, imageLoadTimeoutMs);

  img.addEventListener("load", () => {
    clearTimeout(loadTimer);
    // naturalWidth = 0 => ảnh bị chặn/lỗi
    imageOk = img.naturalWidth > 0 && img.naturalHeight > 0;
    if (!imageOk) destroy(false);
  });

  img.addEventListener("error", () => {
    clearTimeout(loadTimer);
    imageOk = false;
    destroy(false);
  });
})();
