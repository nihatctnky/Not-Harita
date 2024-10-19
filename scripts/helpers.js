
import { gotoIcon, homeIcon, jobIcon, parkIcon } from "./constants.js";

//  statüs degerine baglı olarak dogru ikonu return eden fonsiyon
function getIcon(status) {
    switch (status) {
        case "goto":
            return gotoIcon;
        case "home":
            return homeIcon;
        case "job":
            return jobIcon;
        case "park":
            return parkIcon;
        default:
            return undefined;
    }
}
export default getIcon;



//  statüs degerinin türkçe karşılıgını return eden fonksiyon

export function getstatus(status) {
    switch (status) {
        case "goto":
            return "Ziyaret";
        case "home":
            return "Ev";
        case "job":
            return "İş";
        case "park":
            return "Park";
        default:
            return "Varsayılan";


    }
}