console.log("Listening for message")
window.onload = function() {
    document.getElementById("b1").onclick = function () {
        chrome.storage.sync.get(['url'], function(result) {
            fetch(`http://localhost:5335/?url=${result.url}`)
            .then(r => r.json())
            .then(r => {
                document.querySelector('#Hi').innerHTML=JSON.stringify(r);
            })
            .catch(err => console.error(err))
        });
    }

    document.getElementById("closebutton").onclick = function () {
        window.close();
    }


}
