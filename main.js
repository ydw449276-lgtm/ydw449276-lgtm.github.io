/**
 * main.js — 沉疯的个人网站交互逻辑 (优化了慢速波浪与果冻复制动画)
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* ----------------------------------------------------------
     1. 实体波浪扩散切换深浅主题
  ---------------------------------------------------------- */
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme") || "light";
  body.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", (e) => {
      if (themeToggle.disabled) return;
      themeToggle.disabled = true;

      const x = e.clientX;
      const y = e.clientY;
      const currentTheme = body.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      
      const oldBg = getComputedStyle(body).backgroundColor;
      document.documentElement.style.backgroundColor = oldBg;
      body.style.backgroundColor = "transparent";

      const wave = document.createElement("div");
      wave.className = "theme-wave";
      wave.style.left = x + "px";
      wave.style.top = y + "px";
      wave.style.backgroundColor = newTheme === "dark" ? "#121212" : "#F7F5F0";
      body.appendChild(wave);

      requestAnimationFrame(() => {
        wave.classList.add("animate");
      });

      // 🌟 配合变慢的 CSS 波浪，这里的文字变色时机推迟到了 500ms
      setTimeout(() => {
        body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
      }, 500);

      // 🌟 清理战场的时机也推迟到 1200ms，等 1.2 秒的波浪完全画完
      setTimeout(() => {
        body.style.transition = "none";
        body.style.backgroundColor = "";
        document.documentElement.style.backgroundColor = "";
        wave.remove();
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            body.style.transition = "";
          });
        });
        themeToggle.disabled = false;
      }, 1200);
    });
  }

  /* ----------------------------------------------------------
     2. 汉堡菜单 & 侧边栏
  ---------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const sidebar   = document.getElementById("sidebar");
  const overlay   = document.getElementById("overlay");

  function openSidebar() {
    hamburger.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    sidebar.classList.add("is-open");
    sidebar.setAttribute("aria-hidden", "false");
    overlay.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    sidebar.classList.remove("is-open");
    sidebar.setAttribute("aria-hidden", "true");
    overlay.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

  function toggleSidebar() {
    if (sidebar.classList.contains("is-open")) closeSidebar();
    else openSidebar();
  }

  if(hamburger) hamburger.addEventListener("click", toggleSidebar);
  if(overlay) overlay.addEventListener("click", closeSidebar);

  /* ----------------------------------------------------------
     3. "其他" 子菜单展开/收起
  ---------------------------------------------------------- */
  const groupToggle = document.querySelector(".nav-group-toggle");
  if (groupToggle) {
    const subMenu = groupToggle.nextElementSibling;
    groupToggle.addEventListener("click", () => {
      const isExpanded = groupToggle.getAttribute("aria-expanded") === "true";
      groupToggle.setAttribute("aria-expanded", !isExpanded);
      if (isExpanded) subMenu.classList.remove("is-open");
      else subMenu.classList.add("is-open");
    });
  }

  /* ----------------------------------------------------------
     4. 页面 Reveal 动画
  ---------------------------------------------------------- */
  const revealTargets = document.querySelectorAll("[data-reveal], .about-block, .oc-section, .back-wrap");
  if (revealTargets.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  const btnMains = document.querySelectorAll(".btn-main");
  if (btnMains.length > 0) {
    const btnObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Array.from(btnMains).indexOf(entry.target);
          setTimeout(() => entry.target.classList.add("is-revealed"), index * 120);
          btnObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    btnMains.forEach((btn) => btnObserver.observe(btn));
  }

  /* ----------------------------------------------------------
     5. 页面跳转过渡动画
  ---------------------------------------------------------- */
  const cover = document.getElementById("transitionCover");
  if (cover) {
    cover.style.opacity = "1";
    cover.style.transition = "none";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cover.style.transition = "opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
        cover.style.opacity = "0";
      });
    });

    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto")) return;

      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.href;
        cover.style.transition = "opacity 0.35s cubic-bezier(0.4, 0, 1, 1)";
        cover.style.opacity = "1";
        setTimeout(() => window.location.href = target, 360);
      });
    });
  }

  /* ----------------------------------------------------------
     6. 内页线条动画 & 首页滚动 Hint
  ---------------------------------------------------------- */
  const innerHeader = document.querySelector(".inner-header[data-reveal]");
  if (innerHeader) {
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          innerHeader.classList.add("is-revealed");
          headerObserver.unobserve(innerHeader);
        }
      });
    }, { threshold: 0.1 });
    headerObserver.observe(innerHeader);
  }

  const scrollHint = document.getElementById("scrollHint");
  if (scrollHint) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 60) {
        scrollHint.style.opacity = "0";
        scrollHint.style.transition = "opacity 0.4s ease";
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     7. 剪贴板复制逻辑
  ---------------------------------------------------------- */
  const copyBtns = document.querySelectorAll(".copy-btn");
  copyBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); 
      e.stopPropagation(); 
      
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        
        btn.classList.add("is-copied");
        
        setTimeout(() => {
          btn.classList.remove("is-copied");
        }, 2000);
        
      }).catch(err => {
        console.error('复制失败: ', err);
        alert("浏览器权限限制，复制失败，请手动选择复制。");
      });
    });
  });

});
