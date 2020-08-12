var html = '<head><base href="/" /></head>' +
    '<body><div style="padding: 30px;overflow-wrap: break-word; ' +
    'font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji,Segoe UI Emoji, Segoe UI Symbol;">' +
    '<h1 style="font-size: 120%;font-weight:bold;margin:8px 0 8px 0;">Oops, we had an issue</h1>' +
    '<p>Your browser is not supported by this app. Please update or use a different browser.</p>' +
    '<p><small>We recommend chrome: <a href="https://www.google.com/chrome/" target="new">click here</a></p></small></div></body>';
try {
    window.document.getElementsByTagName('html')[0].innerHTML = html;
} catch (e) {
    window.document.write('<html>' + html + '</html>');
    window.document.close();
}
