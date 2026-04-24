window.Widgets = window.Widgets || {};

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-widget]').forEach(function(el) {
    var name = el.dataset.widget;
    if (window.Widgets[name]) {
      window.Widgets[name](el);
    } else {
      el.textContent = '[Widget "' + name + '" not found]';
    }
  });
});
