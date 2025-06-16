fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;
        // Bootstrap needs DOM to be ready, so load it AFTER navbar is injected
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);
    });