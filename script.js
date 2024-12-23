
function openSidebar() {
    document.getElementById("sidebar").style.left = "0";
}


function closeSidebar() {
    document.getElementById("sidebar").style.left = "-250px";
}


function toggleContent(contentId) {

    let allContent = document.querySelectorAll('.hidden-content');
    allContent.forEach(content => content.style.display = 'none');
    document.getElementById(contentId).style.display = 'block';
}