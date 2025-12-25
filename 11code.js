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

  const lastClosed = localStorage.getItem(storageKey);
  const now = Date.now();
  if (lastClosed && now - parseInt(lastClosed, 10) < delayMinutes * 60 * 1000) return;

  const randomImage = images[Math.floor(Math.random() * images.length)];
  const randomLink = targetUrls[Math.floor(Math.random() * targetUrls.length)];

  // ===== Overlay (click ngoài để tắt) =====
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.zIndex = "9998";
  overlay.style.background = "rgba(0,0,0,0.35)"; // hơi tối nền
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";

  // ===== Banner =====
  const banner = document.createElement("div");
  banner.style.position = "relative";
  banner.style.zIndex = "9999";
  banner.style.width = "300px";
  banner.style.height = "200px";
  banner.style.background = "#fff";
  banner.style.border = "3px solid #000";
  banner.style.borderRadius = "10px";
  banner.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
  banner.style.overflow = "hidden";

  // Chỉ bấm vào HÌNH mới mở Shopee
  const img = document.createElement("img");
  img.src = randomImage;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.display = "block";
  img.style.cursor = "pointer";

  // ===== Nút X lớn + vòng tròn đen trong suốt =====
  const close = document.createElement("button");
  close.type = "button";
  close.innerHTML = "&times;";
  close.setAttribute("aria-label", "Close");
  close.style.position = "absolute";
  close.style.top = "8px";
  close.style.right = "8px";
  close.style.width = "42px";
  close.style.height = "42px";
  close.style.borderRadius = "50%";
  close.style.border = "0";
  close.style.background = "rgba(0,0,0,0.55)"; // vòng tròn đen trong suốt
  close.style.color = "#fff";
  close.style.fontSize = "30px";
  close.style.lineHeight = "42px";
  close.style.textAlign = "center";
  close.style.cursor = "pointer";
  close.style.zIndex = "10000";
  close.style.padding = "0";
  close.style.userSelect = "none";

  // Gom vào DOM
  banner.appendChild(img);
  banner.appendChild(close);
  overlay.appendChild(banner);
  document.body.appendChild(overlay);

  let removed = false;
  const removeAll = () => {
    if (removed) return;
    removed = true;
    overlay.remove();
  };

  // (2) Chỉ bấm vào hình quảng cáo mới nhảy Shopee
  img.addEventListener("click", function (e) {
    e.stopPropagation();

    // (3) Bấm hình -> tính 2 phút
    localStorage.setItem(storageKey, Date.now().toString());

    const linkElement = document.createElement("a");
    linkElement.href = randomLink;
    linkElement.target = "_blank";
    linkElement.rel = "noopener noreferrer nofollow";
    document.body.appendChild(linkElement);
    linkElement.click();
    linkElement.remove();

    removeAll();
  });

  // (3) Bấm X -> tính 2 phút
  close.addEventListener("click", function (e) {
    e.stopPropagation();
    localStorage.setItem(storageKey, Date.now().toString());
    removeAll();
  });

  // (2) & (3) Bấm bên ngoài banner: chỉ tắt QC, KHÔNG tính 2 phút
  overlay.addEventListener("click", function () {
    removeAll();
  });

  // Ngăn click trong banner (nhưng ngoài hình/X) không bị coi là "bên ngoài"
  banner.addEventListener("click", function (e) {
    e.stopPropagation();
  });
})();
