console.log('app.js');


function hide(id) {
    console.log(`hide(${id})`);
    var x = document.getElementById(id);
    console.log(x.className);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
    // if (x.className.indexOf("w3-hide") == -1) {
    //     x.className += " w3-hide";
    // } else {
    //     x.className = x.className.replace(" w3-hide", "");
    // }
}