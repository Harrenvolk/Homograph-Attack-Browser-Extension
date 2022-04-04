function is_punycode(url) {
    let url_without_protocol = url.split("://");
    url = url_without_protocol[url_without_protocol.length - 1];
    return url.split('/')[0].split('.').filter(section => {
        return section.startsWith('xn--')
    }).length != 0;
}

var CUSTOM_CLASS_NAME = "homoglyph-extension-link";

function check_suspicious_links() {
    let all_links = document.getElementsByTagName("a");
    for (let i = 0; i < all_links.length; i++) {
        if (is_punycode(all_links[i].href)) {
            if(all_links[i].className.includes(CUSTOM_CLASS_NAME)) continue;
            all_links[i].className = CUSTOM_CLASS_NAME;
            let converted_domain_name=all_links[i].href.split('://')[1].replace('/', '').replace('www.', '')
            fetch("https://e502-2409-4071-e9c-675c-e2be-de72-d414-4e79.ngrok.io/predict?url="+converted_domain_name)
                .then(r => r.json())
                .then((r) => {
                    if(r.verdict==="unsafe"){
                        all_links[i].style = "background-color:#fb8181"
                        all_links[i].onclick=() => window.confirm("This link might be trying to imitate another website. Are you sure you want to go to the link?");
                    }
                    else if(r.verdict==="unsure"){
                        all_links[i].style = "background-color:yellow"
                        all_links[i].onclick=() => window.confirm("This link might be trying to imitate another website. Are you sure you want to go to the link?");
                    }
                    else if(r.verdict==="safe")
                        all_links[i].style = "background-color:lightgreen"
                })
        }
    }
}

check_suspicious_links();

new MutationObserver(function(mutations) {
    // console.log(mutations[0].target.nodeValue);
    check_suspicious_links();
}).observe(
    document.querySelector('title'),
    { subtree: true, characterData: true, childList: true }
);