function main() {
    let szam = Math.floor(Math.random() * 1000000);
    //alert(szam);
    osszehasonlito(szam);
}

function beker() {
    let szam_e = 0;
    let szam = 0;
    do {
        szam = prompt("adja meg a tippjét:");
        szam_e = parseInt(szam);
        if (isNaN(szam_e) == true) {
            alert("számot adjon meg");
        }
    } while (isNaN(szam_e))
    return szam;
}
function osszehasonlito(szam) {
    for (let i = 0; i < 21; i++) {
        let tipp = beker();
        if (tipp == szam) {
            alert("Gratulálok, "+ (i+1) + " lépésből eltaláltad!");
            return
        }
        else if (tipp < szam)
            alert(`${tipp} tipp nem talált: A megoldás nagyobb.`);
        else
            alert(`${tipp} tipp nem talált: A megoldás kisebb.`);
    }
    alert("Sajnos ez most nem sikerült!");
}
