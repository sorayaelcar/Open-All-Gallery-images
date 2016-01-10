// ==UserScript==
// @name        Open All Gallery Images
// @namespace   http://userscripts.org/users/478287
// @description Opens all the posts on a page in a new tab.
// @include     http*://*e621.net/*
// @exclude     https://e621.net/post/show/*
// @include     http*://*gelbooru.com/*
// @exclude     http*://*gelbooru.com/index.php?page=post&s=view&id=*
// @include     http://thedoujin.com/index.php/categories/*
// @exclude     http://thedoujin.com/index.php/pages/*
// @include     http*://*rule34.xxx/*
// @exclude     http*://*rule34.xxx/index.php?page=post&s=view&id=*
// @include     https://inkbunny.net/submissionsviewall.php*
// @exclude     https://inkbunny.net/submissionview.php*
// @version     1.3.0
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright   2012-2016, Soraya Elcar (http://userscripts.org/users/soraya)
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// ==/UserScript==


var base_button_label = "Open all images in tabs!";

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function get_all_posts() {
    // Gets all links to posts pages from the current page.
    var regex = new RegExp(/\/post\/show\/\d+|page=post&s=view&id=\d+|\/pages\/\d+|submissionview\.php/),
        links = [],
        all_links = document.getElementsByTagName("a"),
        link;

    for(var i=0; i<all_links.length; i++) {
        href = all_links[i].href;
        if (regex.test(href)) {
            if (!(contains(links, href))) {
                links.push(href);
            }
        }
    }
    return links;
}

function open_all_in_tabs() {
    // Open all the links in the current posts page as new tabs.
    var all_links = get_all_posts().reverse();

    for (var i=0; i<all_links.length; i++) {
        GM_openInTab(all_links[i]);
    }

    // Set the button to green and let the user know we're done opening tabs.
    var button = document.getElementById("openAllImagesInTabsButton");
    button.style.background = '#00FF00';
    button.value = base_button_label + " (Done.)";
    button.disabled = false;
}

function do_button() {
    // Disable the button so people don't get 100000 tabs.
    var button = document.getElementById("openAllImagesInTabsButton");
    button.disabled = true;
    button.style.background = '#FF0000';
    button.value = base_button_label + " (Working...)";

    // Now load all the images:
    open_all_in_tabs();

}


function inject_button() {
    var button = document.createElement("input");
    button.id = "openAllImagesInTabsButton";
    button.value = base_button_label;
    button.type = 'button';
    button.onclick = do_button;
    
    var targets = [document.getElementById("navbar"), 
                   getElementByXpath('/html/body/div[1]/div'),
                   getElementByXpath('/html/body/center/div/div[5]/div[2]/div[4]'),
                   getElementByXpath('/html/body/div[5]/div[3]'),
                   ];
    console.log(targets);
    for (var index in targets) {
        
        var target = targets[index];
        
        if (target === null) {
            continue;
        }
        
        console.log(target);
        target.appendChild(button);
    }
}

window.addEventListener("load", function(e) {
    GM_registerMenuCommand("Open all in tabs!", open_all_in_tabs, 'a');
    inject_button();
}, false);

$(document).ready(function() {
        inject_button();
});
