/* ============================================================================
   DEPENDABLE CARRIAGES — main.js
   ----------------------------------------------------------------------------
   1. Sticky-header background on scroll
   2. Mobile navigation toggle
   3. Scroll-reveal animations (IntersectionObserver)
   4. Footer year
   5. Booking form — accessible validation + submission handler
   ----------------------------------------------------------------------------
   TO CONNECT A REAL BACKEND: see the `submitBooking()` function near the bottom.
   Replace the simulated submit with a fetch() to your endpoint or form service.
   ========================================================================== */
(function () {
  "use strict";

  /* ======================================================================
     CONFIG  ←  PASTE YOUR FORMSPREE ENDPOINT HERE
     ----------------------------------------------------------------------
     1. Sign up at https://formspree.io and create a new form.
     2. Point the form's notification email at: info@dependablecarriages.net
     3. Copy the endpoint URL it gives you (looks like the example below)
        and paste it in to replace YOUR_FORM_ID.
     Until you do, the form falls back to opening the visitor's email app
     so nothing is ever lost.
     ==================================================================== */
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgyjvnz";

  /* ----------------------------------------------------------------------
     1. STICKY HEADER — add a solid background once the user scrolls
     -------------------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------------
     2. MOBILE NAVIGATION
     -------------------------------------------------------------------- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  navToggle.addEventListener("click", function () {
    setNav(!nav.classList.contains("is-open"));
  });
  // Close menu when a link is tapped
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setNav(false);
  });
  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) setNav(false);
  });

  /* ----------------------------------------------------------------------
     3. SCROLL-REVEAL ANIMATIONS
     Adds .is-revealed to elements with [data-reveal] / [data-reveal-group]
     when they enter the viewport. Respects prefers-reduced-motion.
     -------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal], [data-reveal-group]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-revealed"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------------------
     4. FOOTER YEAR
     -------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------------
     5. BOOKING FORM — validation + submission
     -------------------------------------------------------------------- */
  var form = document.getElementById("bookingForm");
  if (!form) return;
  var statusEl = document.getElementById("formStatus");

  // Prevent booking dates in the past
  var dateInput = document.getElementById("date");
  if (dateInput) {
    var today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }

  // Validation rules per field
  var validators = {
    pickup:     function (v) { return v.trim() ? "" : "Please enter a pickup location."; },
    dropoff:    function (v) { return v.trim() ? "" : "Please enter a drop-off location."; },
    date:       function (v) { return v ? "" : "Please choose a date."; },
    time:       function (v) { return v ? "" : "Please choose a time."; },
    passengers: function (v) { return v ? "" : "Select the number of passengers."; },
    vehicle:    function (v) { return v ? "" : "Select a vehicle type."; },
    name:       function (v) { return v.trim().length >= 2 ? "" : "Please enter your name."; },
    phone:      function (v) {
      var digits = v.replace(/\D/g, "");
      return digits.length >= 7 ? "" : "Please enter a valid phone number.";
    },
    email:      function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address.";
    }
  };

  function showError(field, message) {
    var wrapper = field.closest(".field");
    var errorEl = form.querySelector('[data-error-for="' + field.id + '"]');
    if (message) {
      wrapper.classList.add("field--error");
      field.setAttribute("aria-invalid", "true");
      if (errorEl) {
        errorEl.textContent = message;
        field.setAttribute("aria-describedby", "err-" + field.id);
        errorEl.id = "err-" + field.id;
      }
    } else {
      wrapper.classList.remove("field--error");
      field.removeAttribute("aria-invalid");
      if (errorEl) errorEl.textContent = "";
    }
  }

  function validateField(field) {
    var rule = validators[field.name];
    if (!rule) return true;
    var msg = rule(field.value);
    showError(field, msg);
    return !msg;
  }

  // Live-clear errors as the user corrects them
  Object.keys(validators).forEach(function (name) {
    var field = form.elements[name];
    if (!field) return;
    field.addEventListener("blur", function () { validateField(field); });
    field.addEventListener("input", function () {
      if (field.closest(".field").classList.contains("field--error")) validateField(field);
    });
  });

  function setStatus(type, message) {
    statusEl.textContent = message;
    statusEl.className = "form__status is-visible form__status--" + type;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusEl.className = "form__status"; // reset

    // Validate all fields
    var firstInvalid = null;
    var allValid = true;
    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (field && !validateField(field)) {
        allValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!allValid) {
      setStatus("err", "Please correct the highlighted fields and try again.");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Collect data
    var data = {
      pickup:     form.elements.pickup.value.trim(),
      dropoff:    form.elements.dropoff.value.trim(),
      date:       form.elements.date.value,
      time:       form.elements.time.value,
      passengers: form.elements.passengers.value,
      vehicle:    form.elements.vehicle.value,
      name:       form.elements.name.value.trim(),
      phone:      form.elements.phone.value.trim(),
      email:      form.elements.email.value.trim(),
      notes:      form.elements.notes.value.trim()
    };

    submitBooking(data);
  });

  /* ----------------------------------------------------------------------
     SUBMISSION HANDLER — Formspree
     ----------------------------------------------------------------------
     Sends the quote request to your Formspree form, which emails it to
     info@dependablecarriages.net. The visitor stays on the page and sees
     a confirmation message.

     If the endpoint is still the placeholder (YOUR_FORM_ID), or the request
     fails, we fall back to opening the visitor's email client pre-filled,
     so a request is never lost.
     -------------------------------------------------------------------- */
  function submitBooking(data) {
    var btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Sending…";

    function reset() {
      btn.disabled = false;
      btn.textContent = "Request My Quote";
    }

    // Endpoint not configured yet → use the mailto fallback.
    if (FORMSPREE_ENDPOINT.indexOf("YOUR_FORM_ID") !== -1) {
      mailtoFallback(data);
      reset();
      return;
    }

    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        // Friendly labels so the email Formspree sends you is easy to read
        "Pickup":      data.pickup,
        "Drop-off":    data.dropoff,
        "Date":        data.date,
        "Time":        data.time,
        "Passengers":  data.passengers,
        "Vehicle":     data.vehicle,
        "Name":        data.name,
        "Phone":       data.phone,
        "Email":       data.email,
        "Notes":       data.notes || "—",
        // Replies from your inbox go straight to the customer
        "_replyto":    data.email,
        "_subject":    "New quote request — " + data.name
      })
    })
    .then(function (r) {
      if (r.ok) { onSuccess(); }
      else { throw new Error("Bad response"); }
    })
    .catch(function () {
      // Network/endpoint problem → don't lose the request, offer mailto.
      mailtoFallback(data);
    })
    .then(reset, reset);
  }

  // Opens the visitor's email app with the request pre-filled.
  function mailtoFallback(data) {
    var subject = encodeURIComponent("Quote request — " + data.name);
    var body = encodeURIComponent(
      "Pickup: " + data.pickup + "\n" +
      "Drop-off: " + data.dropoff + "\n" +
      "Date: " + data.date + " " + data.time + "\n" +
      "Passengers: " + data.passengers + "\n" +
      "Vehicle: " + data.vehicle + "\n" +
      "Name: " + data.name + "\n" +
      "Phone: " + data.phone + "\n" +
      "Email: " + data.email + "\n" +
      "Notes: " + (data.notes || "—")
    );
    window.location.href =
      "mailto:info@dependablecarriages.net?subject=" + subject + "&body=" + body;
    onSuccess();
  }

  function onSuccess() {
    setStatus("ok", "Thank you, " + (form.elements.name.value.trim().split(" ")[0] || "")
      + ". Your request has been received — we'll be in touch shortly with your quote.");
    form.reset();
    statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }

})();
