console.log("Listening for message")
window.onload = function() {
    document.getElementById("b1").onclick = function () {
        chrome.tabs.create({url:"https://www.google.com"})
    }
}
console.log("Ending", chrome)