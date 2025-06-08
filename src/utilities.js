localStorage.setItem(
  "theme-name",
  localStorage.getItem("theme-name") ?? "cyan"
);

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function isMobile() {
  return /Mobi|Android|android|iphone|ipad|ipod|opera mini|iemobile|blackberry/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  );
}

function centrar_verticalmente_scroll(elemento){
  const elementRect = elemento.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const middle = absoluteElementTop - (window.innerHeight / 2) + (elemento.offsetHeight / 2);
  
  window.scrollTo({
    top: middle,
    behavior: "smooth" 
  });
}

export default {
  isTouchDevice,
  isMobile,
  centrar_verticalmente_scroll
};
