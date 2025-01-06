function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {
    let isProcessing = false;
    function onScanSuccess(decodedText) {
        if (isProcessing) return; // Cegah pemanggilan ulang
        isProcessing = true; // Set flag menjadi true

        const extractedURL = extractURL(decodedText);

        // Pastikan URL ada dan valid
        if (extractedURL && isValidURL(extractedURL)) {
            const newurl = extractedURL;

            // Buka URL di tab baru
            const newTab = window.open(newurl, "_blank");

            // Tutup tab baru setelah 5 detik
            setTimeout(() => {
                if (newTab) {
                    newTab.close();
                }
                window.focus(); // Fokus kembali ke tab scanner
                isProcessing = false; // Reset flag setelah selesai
            }, 6000);

            // Tampilkan Snackbar
            setTimeout(() => showSnackbar("Scanned successfully!"), 7000); // Delay 1 detik sebelum snackbar muncul

        } else {
            showSnackbar("Invalid QR Code!");
            isProcessing = false; // Reset flag jika gagal
        }

        console.log("Scanned result:", decodedText);
    }

    let html5QrCode = new Html5QrcodeScanner("my-qr-reader", {
        fps: 10,
        qrbox: 250,
    });
    html5QrCode.render(onScanSuccess);
});

function showSnackbar(message) {
    const snackbar = document.getElementById("snackbar");
    snackbar.textContent = message;

    // Tambahkan kelas untuk menampilkan snackbar
    snackbar.classList.remove("hidden");
    snackbar.classList.add("show");

    // Hapus kelas setelah 5 detik
    setTimeout(() => {
        snackbar.classList.add("hidden");
        snackbar.classList.remove("show");
    }, 5000);
}

function extractURL(input) {
    const prefix = "MTSMUH-";

    // Periksa apakah string diawali dengan prefix
    if (input.startsWith(prefix)) {
        // Ambil URL dengan menghapus prefix
        const url = input.slice(prefix.length);
        return url; // Langsung kembalikan hasil URL yang sudah dipotong
    } else {
        return null; // Kembalikan null jika prefix tidak valid
    }
}


function isValidURL(string) {
    try {

        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
