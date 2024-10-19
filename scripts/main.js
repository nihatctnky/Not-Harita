
import { personIcon } from "./constants.js";
import getIcon, { getstatus } from "./helpers.js";

import ui from "./ui.js";




// Global degişkenler 
// Haritadaki tıklanan son konum

let map;
let clickedCoords;
let layer;
let notes = JSON.parse(localStorage.getItem("notes")) || [];



/* Kullanıcın konumunu paylaşmak istedigini sorcaz 
1.Paylaşırsa haritayı kullanıcınınkonumuna göre ayarlıcaz
2.Paylaşmazsa konumunu ankaraya ayarlıcaz
*/

window.navigator.geolocation.getCurrentPosition(
    (e) => {
        loadMap([e.coords.latitude, e.coords.longitude], "Mevcut Konum");
    },
    () => {
        console.log("kabul etmedi..");
    }
);

//  Haritayı yükleme
function loadMap(currentPosition, msg) {
    // 1.HARİTA kurulum/ Merkez belirleme

    map = L.map("map", { zoomControl: false, }).setView(currentPosition, 8);

    // Sag aşagıya zoom buttonları ekleme

    L.control
        .zoom({
            position: "bottomright",
        })
        .addTo(map);


    // 2. Haritayı ekrana basar
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {

        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Haritanın üzerine imleçleri ekleyecegeimiz katman oluşturma

    layer = L.layerGroup().addTo(map);

    // 3. İmleç EkLeme
    L.marker(currentPosition, { icon: personIcon }).addTo(map).bindPopup(msg);

    // 4.Haritada tıklanma olayı
    map.on("click", onMapClick);

    // 5.Ekrana daha önce eklenen notları bas
    renderNotes();
    renderMakers();


}

//Haritaya  Tıklanma olayında çalışıcak fonksiyon tanımla
function onMapClick(e) {
    // Tıklanan konumun kordinatlarını global degişkene aktar
    clickedCoords = [e.latlng.lat, e.latlng.lng];

    // aside elementlrine add class ekle
    ui.aside.className = "add";

}

// iptal butonuna tıkanınca 
ui.cancelBtn.addEventListener("click", () => {
    // aside elementlerinden add class kaldır
    ui.aside.className = "";

});

// Form gönderilince

ui.form.addEventListener("submit", (e) => {
    // Sayfa yenilenmesini yenileme
    e.preventDefault();

    // İnputlardaki verilere erişm
    const title = e.target[0].value;
    const date = e.target[1].value;
    const status = e.target[2].value;

    // Yeni birnesne oluşturma
    const newNote = {
        id: new Date().getTime(),
        title,
        date,
        status,
        coords: clickedCoords,
    };


    // nesneyi global degişkene kaydet
    notes.unshift(newNote);

    // localstorage güncelle
    localStorage.setItem("notes", JSON.stringify(notes));
    // asid alanından "add" clas kaldır
    ui.aside.className = "";

    //  formu temizle
    e.target.reset();
    // Yeni notun ekrana gelmesi için notları tekrardan rendler
    renderNotes();
    renderMakers();
});

// Ekrana notları bas
function renderNotes() {
    const noteCards = notes
        .map((item) => {
            // tarihi kullanıcı dostu formata çevir
            const date = new Date(item.date).toLocaleString("tr", {
                day: "2-digit",
                month: "long",
                year: "2-digit",
            });

            // status değerini çevir
            const status = getstatus(item.status);

            // oluşturulcak note'un html içeriğini belirle
            return `
          <li>
              <div>
                <p>${item.title}</p>
                <p>${date}</p>
                <p>${status}</p>
              </div>
  
              <div class="icons">
                <i data-id="${item.id}" class="bi bi-airplane-fill" id="fly"></i>
                
                <i data-id="${item.id}" class="bi bi-trash3-fill" id="delete" ></i>
              </div>
            </li>
    `;
        })
        .join("");

    // note'ları liste alanında renderla
    ui.list.innerHTML = noteCards;

    // delete iconlarını al ve tıklanınca silme fonksiyonunu çağır
    document.querySelectorAll("li #delete").forEach((btn) => {
        btn.addEventListener("click", () => deleteNote(btn.dataset.id));
    });

    // fly iconlarını al ve tıklanınca uçuş fonksiyonunu çağır
    document.querySelectorAll("li #fly").forEach((btn) => {
        btn.addEventListener("click", () => flyToLocation(btn.dataset.id));
    });
}
// Ekrana imleçlri bas
function renderMakers() {
    // Eski imleçleri markarları temizleme
    layer.clearLayers();
    notes.forEach((item) => {
        const icon = getIcon(item.status);
        // marker oluştur
        L.marker(item.coords, { icon: icon }) //imleç oluştur
            .addTo(layer) //imleç ekle
            .bindPopup(item.title); //imleç pop ekle
    });
}

// silme butonua tıklayınca

function deleteNote(id) {

    const res = confirm("Notu silmeyi onaylıyormusunuz..*");

    // Onaylarsa sil

    if (res) {

        //    id bildigimiz elemanı diziden kaldır
        notes = notes.filter((note) => note.id !== +id);

        // Localstroge güncelle

        localStorage.setItem("notes", JSON.stringify(notes));

        // Güncel notları ekrana bas
        renderNotes();

        //  Güncel imleçleri ekrana bas
        renderMakers();
    }
}

// uçuş butonuna tıklayınca 

function flyToLocation(id) {

    // id bilinen elemanı dizide bul
    const note = notes.find((note) => note.id === +id);
    // Note koordinatlarını uç

    map.flyTo(note.coords, 12);

}


// Tıklanma olayında
// aside alanındaki form veya liste içerigini, gizlemek için hide class ekle
ui.arrow.addEventListener("click", () => {
    ui.aside.classList.toggle("hide")
});