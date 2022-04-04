console.log("Listening for message")
window.onload = function () {
    chrome.storage.sync.get(['url'], function (result) {
        document.getElementById("b1").onclick = function () {
            chrome.storage.sync.set({ redirected: result.url });
            window.close();
        }
        $('#dummy').on('click', () => {
            
            const URL = "https://1817-2409-4042-e96-62c8-c6ea-d338-39ca-c250.ngrok.io/predict?url=" + result.url.split('://')[1].replace('/', '').replace('www.', '');
            // const URL = "https://5041-202-164-132-133.ngrok.io/predict?url=" + result.url.replace(/^http+:\/\//, '').replace('/', '').replace('www.', '');
            // $("#safe").text(result.url + '   ' + URL);
            fetch(URL)
                .then(r => r.json())
                .then(r => {
                    if (r.verdict === 'safe') {
                        $('#safe').text('safe!!');
                        setTimeout(()=>$('#b1').click(),1);
                    } else {
                        $('#suggested_links').css('display', 'block');
                        $('#safe').css('display', 'none');
                        const list = $('.links');
                        r.suggestions.forEach((suggestion) => {
                            list.append($('<li/>')
                                .text(suggestion)
                                .on('click', () => {
                                    chrome.tabs.create({ url: "https://" + suggestion });
                                    window.close();
                                }))
                        })
                    }
                })
                .catch(err => console.error(err));

        })
    })

    // document.getElementById("closebutton").onclick = function () {
    //     window.close();
    // }
    setTimeout(() => $("#dummy").click(), 1);
    $('#closebutton').on('click', () => { window.close() })

}
