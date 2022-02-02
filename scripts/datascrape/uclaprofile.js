const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    const data = [];

    // 100 per page and rank desc
    await page.goto(
        "https://profiles.ucla.edu/search/default.aspx?searchtype=people&searchfor=&exactphrase=false&perpage=100&offset=0&page=1&totalpages=32&searchrequest=A81BSfTwU3GNm4liSODkW6vB3EBYO6gz+a5TY1bFhuz1tc7ngL4Orww3064KoquG+9VriFtrDjogfSknlN6Jz7ictMT0qk3g10zM0TMIEPsEyvmx6bLpcnNFGJ4exv4/fFAesBf4NHrkI4nVpsBeSKg1prKuDu5Ad3xZR2IG1VXzQt2Kl5Hs5a708T2/vlG+0DSye5g9KBjG4Q1kuBhnZNV3TLVPhoChvEqCnKALU7a7awqf6lAuskQW4rD5G/OC/lXclIHC7LtUeKfMKIzva4dDNw2yad/+Ztpp+7k5ZCyw78HL/ylb8xtpoTCrpOCblNkbtcHNwmWVhmKSEotaCdKtPoDL1Ce/aO+YXYcU6KD7Dlz0pELaBELBAK3AHzviDwahdZW3kzGCANZthTN7c1mg7RaRHDbO9bXO54C+Dq8MN9OuCqKrhv/QtV0VC1l/tncZFI6GsA7IpJFAbogWvUSniam10xyZzMtUtPFkvKSqnPEO7gfPsl3taATzidUkHiA5/1D/YFLtyfQuU1EJK8mZk0QlNEbahfDRk6WWacn5+oDlZTICP7lyxuKVCYo0cB4cgL0/OB7ipPAvvK8b1qLI4XK0QanMJjIpcyRvY8RRKr03NmSFJZLrTlewVlCrIj0reLGJI35pF2jOOFZEaSI9K3ixiSN+tRvEjqTRbxY=&sortby=facrank&sortdirection=desc&showcolumns=10"
    );
    //   await page.screenshot({ path: 'example.png' });
    function getData() {
        let header;
        [...document.querySelectorAll("#tblSearchResults tr")].forEach(
            (trElem, index) => {
                const rowData = [...trElem.querySelectorAll("th")].map(
                    (elem, index) => {
                        if (!index) {
                            let link = elem.onclick.split("'")[1];
                        }
                        elem.innerText;
                    }
                );
                if (!index) {
                    //header

                    header;
                }
            }
        )[0];
    }

    // await browser.close();
})();
