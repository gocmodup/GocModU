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
  // Key lưu localStorage tên kỹ thuật
  const STORE_KEY = "ui_popup_timestamp"; 
  // --- KẾT THÚC CẤU HÌNH ---


  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const storage = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { } },
  };

  // Kiểm tra thời gian
  const lastClosed = storage.get(STORE_KEY);
  const now = Date.now();
  // Chuyển đổi phút sang mili giây
  if (lastClosed && now - parseInt(lastClosed, 10) < DELAY_MIN * 60000) return;

  const randomImage = pick(images);
  const randomLink = pick(targetUrls);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUI, { once: true });
  } else {
    initUI();
  }

  function initUI() {
    // Tên ID và Class được đặt tên tối nghĩa, tránh các từ khóa "ads", "banner"
    const STYLE_ID = "core-ui-styles";
    const CLS = {
      overlay: "app-modal-backdrop",
      // Hộp chứa bên ngoài, chịu trách nhiệm hiển thị viền gradient
      outerBox: "ui-gradient-container",
      // Hộp chứa bên trong, chịu trách nhiệm bo tròn ảnh và chứa nút đóng
      innerFrame: "media-inner-frame",
      img: "visual-content-asset",
      closeBtn: "ui-dismiss-trigger"
    };

    // Inject CSS
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        .${CLS.overlay}{
          position:fixed; inset:0;
          width:100vw; height:100vh;
          display:flex; align-items:center; justify-content:center;
          background:rgba(0,0,0,.4); /* Nền tối hơn một chút để làm nổi bật popup */
          z-index:2147483640;
          touch-action:manipulation;
          opacity: 0; animation: ui-fade-in 0.3s forwards; /* Thêm hiệu ứng hiện dần */
        }
        @keyframes ui-fade-in { to { opacity: 1; } }

        .${CLS.outerBox}{
          position:relative;
          width:304px; /* Tăng nhẹ kích thước để bù cho viền */
          height:204px;
          /* KỸ THUẬT TẠO VIỀN GRADIENT: Dùng padding làm độ dày viền */
          padding: 3px; 
          /* Màu gradient của viền. Bạn có thể thay đổi mã màu ở đây */
          background: linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%);
          border-radius: 12px; /* Bo góc ngoài */
          box-shadow: 0 10px 30px rgba(0,0,0,.25);
          z-index:2147483641;
          transform: scale(0.95); animation: ui-pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes ui-pop-in { to { transform: scale(1); } }

        .${CLS.innerFrame}{
            position: relative;
            width: 100%; height: 100%;
            background: #fff;
            /* Bo góc trong = Bo góc ngoài - độ dày viền (12px - 3px = 9px) */
            border-radius: 9px; 
            overflow: hidden; /* Cắt ảnh theo góc bo */
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
          backdrop-filter: blur(2px); /* Hiệu ứng mờ nhẹ cho nút đóng */
        }
        .${CLS.closeBtn}:hover{ background:rgba(0,0,0,.8); }
      `;
      document.head.appendChild(style);
    }

    // Tạo cấu trúc DOM
    const overlay = document.createElement("div");
    overlay.className = CLS.overlay;
    overlay.setAttribute("role", "dialog");

    // Hộp ngoài chứa viền gradient
    const outerBox = document.createElement("div");
    outerBox.className = CLS.outerBox;

    // Khung trong chứa ảnh
    const innerFrame = document.createElement("div");
    innerFrame.className = CLS.innerFrame;

    const img = document.createElement("img");
    img.className = CLS.img;
    img.src = randomImage;
    img.alt = "View details"; // Alt text chung chung
    img.loading = "eager";

    const closeBtn = document.createElement("button");
    closeBtn.className = CLS.closeBtn;
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Dismiss");

    // Lắp ráp DOM: innerFrame chứa ảnh + nút -> outerBox chứa innerFrame -> overlay chứa outerBox
    innerFrame.append(img, closeBtn);
    outerBox.appendChild(innerFrame);
    overlay.appendChild(outerBox);
    document.body.appendChild(overlay);

    // --- Xử lý sự kiện ---
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
      // Bấm hình -> Tính thời gian chờ
      storage.set(STORE_KEY, String(Date.now()));
      
      // Mở link (dùng click event chuẩn để trình duyệt tin tưởng)
      const a = document.createElement("a");
      a.href = randomLink;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.click();

      removeAll();
    };

    const onCloseClick = (e) => {
      e.stopPropagation();
      // Bấm X -> Tính thời gian chờ
      storage.set(STORE_KEY, String(Date.now()));
      removeAll();
    };

    const onOverlayClick = (e) => {
      if (e.target === overlay) {
        // Bấm ra ngoài -> Đóng nhưng KHÔNG tính thời gian chờ
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
