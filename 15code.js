(function () {
  "use strict";

  // --- CẤU HÌNH ---
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

  const DELAY_MIN = 2;
  const STORE_KEY = "ui_popup_timestamp"; // Tên key kỹ thuật
  // --- KẾT THÚC CẤU HÌNH ---


  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const storage = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { } },
  };

  // Logic kiểm tra thời gian
  const lastClosed = storage.get(STORE_KEY);
  const now = Date.now();
  if (lastClosed && now - parseInt(lastClosed, 10) < DELAY_MIN * 60000) return;

  const randomImage = pick(images);
  const randomLink = pick(targetUrls);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUI, { once: true });
  } else {
    initUI();
  }

  function initUI() {
    // Tên ID và Class được đặt tên tối nghĩa để tránh Adblock
    const STYLE_ID = "core-ui-styles";
    const CLS = {
      overlay: "app-modal-backdrop",
      outerBox: "ui-gradient-container",
      innerFrame: "media-inner-frame",
      img: "visual-content-asset",
      closeBtn: "ui-dismiss-trigger"
    };

    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        .${CLS.overlay}{
          position:fixed; inset:0;
          width:100vw; height:100vh;
          display:flex; align-items:center; justify-content:center;
          background:rgba(0,0,0,.4);
          z-index:2147483640;
          touch-action:manipulation;
          opacity: 0; animation: ui-fade-in 0.3s forwards;
        }
        @keyframes ui-fade-in { to { opacity: 1; } }

        .${CLS.outerBox}{
          position:relative;
          width:304px; height:204px;
          /* Tạo viền bằng padding + background gradient */
          padding: 3px; 
          background: linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,.25);
          z-index:2147483641;
          transform: scale(0.95); animation: ui-pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes ui-pop-in { to { transform: scale(1); } }

        .${CLS.innerFrame}{
            position: relative;
            width: 100%; height: 100%;
            background: #fff;
            border-radius: 9px; /* 12px - 3px = 9px */
            overflow: hidden;
        }

        .${CLS.img}{
          width:100%; height:100%;
          object-fit:cover; display:block;
          cursor:pointer; -webkit-user-drag:none;
        }

        .${CLS.closeBtn}{
          position:absolute; top:6px; right:6px;
          width:32px; height:32px;
          border-radius:50%; border:none;
          background:rgba(0,0,0,.5);
          color:#fff; font-family:sans-serif; font-size:22px; line-height:32px;
          text-align:center; cursor:pointer; padding:0;
          transition: background .2s ease;
          backdrop-filter: blur(2px);
        }
        .${CLS.closeBtn}:hover{ background:rgba(0,0,0,.8); }
      `;
      document.head.appendChild(style);
    }

    const overlay = document.createElement("div");
    overlay.className = CLS.overlay;
    overlay.setAttribute("role", "dialog");

    const outerBox = document.createElement("div");
    outerBox.className = CLS.outerBox;

    const innerFrame = document.createElement("div");
    innerFrame.className = CLS.innerFrame;

    const img = document.createElement("img");
    img.className = CLS.img;
    img.src = randomImage;
    img.alt = "View details";
    img.loading = "eager";

    const closeBtn = document.createElement("button");
    closeBtn.className = CLS.closeBtn;
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Dismiss");

    innerFrame.append(img, closeBtn);
    outerBox.appendChild(innerFrame);
    overlay.appendChild(outerBox);
    document.body.appendChild(overlay);

    let removed = false;
    const removeAll = () => {
      if (removed) return;
      removed = true;
      img.removeEventListener("click", onImgClick);
      closeBtn.removeEventListener("click", onCloseClick);
      overlay.removeEventListener("click", onOverlayClick);
      document.removeEventListener("keydown", onEscPress);
      overlay.remove();
    };

    const onImgClick = (e) => {
      e.stopPropagation();
      storage.set(STORE_KEY, String(Date.now()));
      
      const a = document.createElement("a");
      a.href = randomLink;
      a.target = "_blank";
      // Đã thêm lại nofollow để an toàn cho SEO
      a.rel = "noopener noreferrer nofollow"; 
      a.click();

      removeAll();
    };

    const onCloseClick = (e) => {
      e.stopPropagation();
      storage.set(STORE_KEY, String(Date.now()));
      removeAll();
    };

    const onOverlayClick = (e) => {
      if (e.target === overlay) {
        removeAll();
      }
    };

    const onEscPress = (e) => {
      if (e.key === "Escape") removeAll();
    };

    img.addEventListener("click", onImgClick);
    closeBtn.addEventListener("click", onCloseClick);
    overlay.addEventListener("click", onOverlayClick);
    document.addEventListener("keydown", onEscPress);
  }
})();
