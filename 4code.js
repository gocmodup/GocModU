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
  if (lastClosed && now - parseInt(lastClosed, 10) < delayMinutes * 60 * 1000) {
    return;
  }

  const randomImage = images[Math.floor(Math.random() * images.length)];
  const randomLink = targetUrls[Math.floor(Math.random() * targetUrls.length)];

  // (Tuỳ chọn) overlay để click ngoài dễ hơn
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "9998";
  overlay.style.background = "rgba(0,0,0,0.0)"; // không tối nền
  document.body.appendChild(overlay);

  const banner = document.createElement("div");
  banner.style.position = "fixed";
  banner.style.top = "50%";
  banner.style.left = "50%";
  banner.style.transform = "translate(-50%, -50%)";
  banner.style.zIndex = "9999";
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
  close.style.top = "5px";
  close.style.right = "10px";
  close.style.fontSize = "24px";
  close.style.color = "#888";
  close.style.cursor = "pointer";
  close.style.zIndex = "10000";

  banner.appendChild(img);
  banner.appendChild(close);
  document.body.appendChild(banner);

  let closed = false;

  function closeBanner(saveTime) {
    if (closed) return;
    if (saveTime) localStorage.setItem(storageKey, Date.now().toString());
    banner.remove();
    overlay.remove();
    closed = true;
  }

  function openShopee() {
    const a = document.createElement("a");
    a.href = randomLink;
    a.target = "_blank";
    a.rel = "noopener noreferrer nofollow";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Click BÊN NGOÀI => đóng QC
  overlay.addEventListener("click", function () {
    closeBanner(true);
  });

  // Chặn click trong banner lan ra overlay
  banner.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Click NÚT X => đóng QC
  close.addEventListener("click", function (e) {
    e.stopPropagation();
    closeBanner(true);
  });

  // Click ẢNH (bên trong) => mở Shopee + đóng QC
  img.addEventListener("click", function (e) {
    e.stopPropagation();
    openShopee();
    closeBanner(true);
  });
})();
