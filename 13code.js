(function () {
  "use strict";

  // Danh sách link đích
  const _d = [
    "https://s.shopee.vn/4fnUm7GK8q",
    "https://s.shopee.vn/1gABt6CIBu",
    "https://s.shopee.vn/8V0W1joWMM",
    "https://s.shopee.vn/7AV8RPYu6F",
  ];

  // Danh sách ảnh
  const _s = [
    "https://i45.servimg.com/u/f45/19/58/16/37/facebo10.jpg",
    "https://i45.servimg.com/u/f45/19/58/16/37/no_mar23.png",
    "https://i45.servimg.com/u/f45/19/58/16/37/no_mar24.png",
    "https://i45.servimg.com/u/f45/19/58/16/37/no_mar25.png",
  ];

  const DELAY_MIN = 2;
  // Tên key lưu trong localStorage mang tính kỹ thuật, tránh từ "banner/ads"
  const STORE_KEY = "sys_cache_ts"; 

  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  const local = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { } },
  };

  // Logic kiểm tra thời gian
  const lastTime = local.get(STORE_KEY);
  const currTime = Date.now();
  const waitMs = DELAY_MIN * 60 * 1000;
  
  if (lastTime && currTime - parseInt(lastTime, 10) < waitMs) return;

  const randImg = pick(_s);
  const randLink = pick(_d);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }

  function bootstrap() {
    // ID style mang tính hệ thống
    const cssId = "ui-core-layer-css"; 
    
    // Tên class tối nghĩa, chung chung
    const CLS = {
      wrap: "app-backdrop-layer",
      box: "info-card-container",
      img: "media-content-view",
      btn: "action-dismiss-btn"
    };

    if (!document.getElementById(cssId)) {
      const style = document.createElement("style");
      style.id = cssId;
      // CSS đã được tối ưu, đổi tên class
      style.textContent = `
        .${CLS.wrap}{
          position:fixed; inset:0;
          width:100vw; height:100vh;
          display:flex; align-items:center; justify-content:center;
          background:rgba(0,0,0,.35);
          z-index:2147483640; /* Số z-index cao nhưng không quá tròn chẵn */
          touch-action:manipulation;
        }
        .${CLS.box}{
          position:relative;
          width:300px; height:200px;
          background:#fff;
          border-radius:10px;
          overflow:hidden;
          box-shadow:0 8px 24px rgba(0,0,0,.15);
          z-index:2147483641;
        }
        .${CLS.img}{
          width:100%; height:100%;
          object-fit:cover;
          display:block;
          cursor:pointer;
          -webkit-user-drag:none;
        }
        .${CLS.btn}{
          position:absolute; top:8px; right:8px;
          width:36px; height:36px;
          border-radius:50%;
          border:none;
          background:rgba(0,0,0,.6);
          color:#fff;
          font-family: sans-serif;
          font-size:24px;
          line-height:36px;
          text-align:center;
          cursor:pointer;
          padding:0;
          z-index:2147483642;
          transition: background .2s;
        }
        .${CLS.btn}:hover{ background:rgba(0,0,0,.8); }
      `;
      document.head.appendChild(style);
    }

    // Tạo DOM
    const wrapper = document.createElement("div");
    wrapper.className = CLS.wrap;
    
    // Accessibility attributes giả lập hộp thoại hệ thống
    wrapper.setAttribute("role", "dialog");
    wrapper.setAttribute("aria-modal", "true");

    const card = document.createElement("div");
    card.className = CLS.box;

    const imgEl = document.createElement("img");
    imgEl.className = CLS.img;
    imgEl.src = randImg;
    imgEl.alt = "Notification"; // Alt trung tính
    imgEl.loading = "eager";

    const btnClose = document.createElement("button");
    btnClose.className = CLS.btn;
    btnClose.innerHTML = "&times;";
    btnClose.setAttribute("aria-label", "Close");

    card.append(imgEl, btnClose);
    wrapper.appendChild(card);
    document.body.appendChild(wrapper);

    let isCleaned = false;

    const cleanup = () => {
      if (isCleaned) return;
      isCleaned = true;
      
      // Gỡ sự kiện để tránh leak memory
      imgEl.removeEventListener("click", handleOpen);
      btnClose.removeEventListener("click", handleClose);
      wrapper.removeEventListener("click", handleOutside);
      document.removeEventListener("keydown", handleEsc);
      
      wrapper.remove();
    };

    const handleOpen = (e) => {
      e.stopPropagation();
      // Click ảnh -> Tính thời gian chờ
      local.set(STORE_KEY, String(Date.now()));

      const link = document.createElement("a");
      link.href = randLink;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();

      cleanup();
    };

    const handleClose = (e) => {
      e.stopPropagation();
      // Click X -> Tính thời gian chờ
      local.set(STORE_KEY, String(Date.now()));
      cleanup();
    };

    const handleOutside = (e) => {
      if (e.target === wrapper) {
        // Click ra ngoài -> Chỉ đóng, KHÔNG tính thời gian chờ (để hiện lại lần sau load trang)
        cleanup(); 
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") cleanup();
    };

    // Dùng sự kiện 'click' chuẩn thay vì pointerdown để tránh xung đột cuộn trang
    imgEl.addEventListener("click", handleOpen);
    btnClose.addEventListener("click", handleClose);
    wrapper.addEventListener("click", handleOutside);
    document.addEventListener("keydown", handleEsc);
  }
})();
