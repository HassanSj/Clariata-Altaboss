try {
  if (typeof window !== "undefined") {
    window.markerConfig = {
      destination: '600080cf496cff038dbd2d71',
    };

    !function (e, r, t) {
      if (e.__Marker) return;
      e.__Marker = {};
      var n = r.createElement("script");
      n.async = 1, n.src = "https://edge.marker.io/latest/shim.js";
      var s = r.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(n, s)
    }(window, document);
  }
} catch (e) {

}