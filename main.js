/**
 * main.js — 沉疯的个人网站交互逻辑
 * 功能：汉堡菜单 / 侧边栏 / 滚动 Reveal / 页面跳转过渡
 */

"use strict";

/* ============================================================
   工具：等待 DOM 加载完成
============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  /* ----------------------------------------------------------
     1. 汉堡菜单 & 侧边栏
  ---------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const sidebar   = document.getElementById("sidebar");
  const overlay   = document.getElementById("overlay");

  /** 打开侧边栏 */
  function openSidebar() {
    hamburger.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    sidebar.classList.add("is-open");
    sidebar.setAttribute("aria-hidden", "false");
    overlay.classList.add("is-visible");
    document.body.style.overflow = "hidden"; // 防止背景滚动
  }

  /** 关闭侧边栏 */
  function closeSidebar() {
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    sidebar.classList.remove("is-open");
    sidebar.setAttribute("aria-hidden", "true");
    overlay.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

  /** 切换侧边栏 */
  function toggleSidebar() {
    if (sidebar.classList.contains("is-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  hamburger.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", closeSidebar);

  // ESC 键关闭
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("is-open")) {
      closeSidebar();
    }
  });

  /* ----------------------------------------------------------
     2. "其他" 子菜单展开/收起
  ---------------------------------------------------------- */
  const groupToggle = document.querySelector(".nav-group-toggle");
  if (groupToggle) {
    const subMenu = groupToggle.nextElementSibling; // .nav-sub

    groupToggle.addEventListener("click", () => {
      const isExpanded = groupToggle.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        groupToggle.setAttribute("aria-expanded", "false");
        subMenu.classList.remove("is-open");
      } else {
        groupToggle.setAttribute("aria-expanded", "true");
        subMenu.classList.add("is-open");
      }
    });
  }

  /* ----------------------------------------------------------
     3. 首页按钮：滚动 Reveal（IntersectionObserver）
  ---------------------------------------------------------- */
  const revealTargets = document.querySelectorAll("[data-reveal], .about-block, .oc-section, .back-wrap");

  if (revealTargets.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target); // 触发一次即可
          }
        });
      },
      {
        threshold: 0.12,    // 12% 进入视口时触发
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     4. 首页按钮延迟 reveal（第二个按钮稍晚出现）
  ---------------------------------------------------------- */
  const btnMains = document.querySelectorAll(".btn-main");
  if (btnMains.length > 0) {
    const btnObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 依次延迟
            const index = Array.from(btnMains).indexOf(entry.target);
            setTimeout(() => {
              entry.target.classList.add("is-revealed");
            }, index * 120);
            btnObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    btnMains.forEach((btn) => btnObserver.observe(btn));
  }

  /* ----------------------------------------------------------
     5. 页面跳转过渡动画（点击链接 → 淡出 → 跳转）
  ---------------------------------------------------------- */
  // 仅对站内链接生效，排除外链与锚点
  const cover = document.getElementById("transitionCover");

  if (cover) {
    // 页面进入时：先遮住（白色），然后淡出
    cover.style.opacity = "1";
    cover.style.transition = "none";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cover.style.transition = "opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
        cover.style.opacity = "0";
      });
    });

    // 监听站内链接点击
    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");

      // 跳过外链、锚点、邮件链接
      if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto")) {
        return;
      }

      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.href;

        // 触发过渡遮罩
        cover.style.transition = "opacity 0.35s cubic-bezier(0.4, 0, 1, 1)";
        cover.style.opacity = "1";

        // 等过渡完成后跳转
        setTimeout(() => {
          window.location.href = target;
        }, 360);
      });
    });
  }

  /* ----------------------------------------------------------
     6. 标题下方装饰线的宽度动画（内页）
  ---------------------------------------------------------- */
  const innerHeader = document.querySelector(".inner-header[data-reveal]");
  if (innerHeader) {
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            innerHeader.classList.add("is-revealed");
            headerObserver.unobserve(innerHeader);
          }
        });
      },
      { threshold: 0.1 }
    );
    headerObserver.observe(innerHeader);
  }

  /* ----------------------------------------------------------
     7. 首页：滚动时淡出 scroll-hint
  ---------------------------------------------------------- */
  const scrollHint = document.getElementById("scrollHint");
  if (scrollHint) {
    const onScroll = () => {
      const scrolled = window.scrollY;
      if (scrolled > 60) {
        scrollHint.style.opacity = "0";
        scrollHint.style.transition = "opacity 0.4s ease";
      } else {
        // 不恢复，避免反复闪现
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

});
