/**
 * main.js — 沉疯的个人网站交互逻辑 (解除封印：支持无延迟无限狂点版)
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* ----------------------------------------------------------
     1. 实体波浪扩散切换深浅主题 (狂点叠加版)
  ---------------------------------------------------------- */
  const themeToggle = document.getElementById("themeToggle");
  let themeState = localStorage.getItem("theme") || "light";
  body.setAttribute("data-theme", themeState);

  let waveCount = 0; // 🌟 新增：波浪计数器，用来管理你狂点时的多层波浪

  if (themeToggle) {
    themeToggle.addEventListener("click", (e) => {
      // 🚨 封印解除：删除了所有的 disabled 限制代码！想点多快点多快！
      
      waveCount++;
      const currentWaveId = waveCount;

      // 瞬间判断这一次点击应该切换到什么颜色
      themeState = themeState === "light" ? "dark" : "light";
      const newTheme = themeState;
      
      const addClass = newTheme === "dark" ? "is-dark" : "is-light";
      const removeClass = newTheme === "dark" ? "is-light" : "is-dark";

      // 🌟 0 毫秒：右上角按钮光速换装
      themeToggle.classList.add(addClass);
      themeToggle.classList.remove(removeClass);

      // 开启底层透明魔法，让多层波浪可以互相叠加展现
      if (body.style.backgroundColor !== "transparent") {
        const oldBg = newTheme === "dark" ? "#F7F5F0" : "#121212";
        document.documentElement.style.backgroundColor = oldBg;
        body.style.backgroundColor = "transparent";
      }

      // 生成一个新的波浪
      const wave = document.createElement("div");
      wave.className = "theme-wave";
      wave.style.left = e.clientX + "px";
      wave.style.top = e.clientY + "px";
      wave.style.backgroundColor = newTheme === "dark" ? "#121212" : "#F7F5F0";
      body.appendChild(wave);

      requestAnimationFrame(() => {
        wave.classList.add("animate");
      });

      // 🌟 50 毫秒：汉堡菜单换装
      setTimeout(() => {
        const hamburger = document.getElementById("hamburger");
        if (hamburger) {
          hamburger.classList.add(addClass);
          hamburger.classList.remove(removeClass);
        }
      }, 50);

      // 🌟 300 毫秒：大部队文字变色
      setTimeout(() => {
        try {
          body.setAttribute("data-theme", newTheme);
          localStorage.setItem("theme", newTheme);
        } catch(err) {
          console.error("Storage error:", err);
        }
      }, 300);

      // 🌟 1600 毫秒：当前这层波浪功成身退
      setTimeout(() => {
        wave.remove(); // 删掉已经扩大到屏幕外的波浪
        
        // 🌟 核心防闪烁机制：只有当你停下手指不点了，才真正打扫战场恢复默认设置
        if (waveCount === currentWaveId) {
          body.style.transition = "none";
          body.style.backgroundColor = "";
          document.documentElement.style.backgroundColor = "";
          
          themeToggle.classList.remove("is-dark", "is-light");
          const hamburger = document.getElementById("hamburger");
          if (hamburger) hamburger.classList.remove("is-dark", "is-light");

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              body.style.transition = "";
            });
          });
        }
      }, 1600);
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
