console.log("Listening for message")
window.onload = function() {
    document.getElementById("b1").onclick = function () {
        // chrome.tabs.create({url:"https://www.google.com"})
        fetch('https://random.justyy.workers.dev/api/random/?cached&n=128')
        .then(r => r.json())
        .then(r => console.log(r))
        .catch(err => console.error(err))
    }
}
console.log("Ending", chrome)