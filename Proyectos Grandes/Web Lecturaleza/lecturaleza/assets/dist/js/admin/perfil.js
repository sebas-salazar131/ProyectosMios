

function displayFileName() {
    const input = document.getElementById('new_imagen');
    const label = input.nextElementSibling;
    const fileName = input.files[0].name;
    label.innerHTML = fileName;
}