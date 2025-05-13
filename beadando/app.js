document.getElementById("neptunInput").addEventListener("input", () => {
  const neptun = document.getElementById("neptunInput").value.trim().toUpperCase();

  // Csak akkor indítjuk el a lekérést, ha 6 karakter hosszú a kód
  if (neptun.length === 6) {
    listCars(neptun);
  } else {
    document.getElementById("carList").innerHTML = "";
  }
});




function loadNavigation() {
    fetch('nav.html')
        .then(res => res.text())
        .then(navHtml => {
            const body = document.querySelector('body');
            body.insertAdjacentHTML('afterbegin', navHtml);
        })
        .catch(err => console.error(err));
}

function listCars(neptun) {
  const carList = document.getElementById("carList");
  carList.innerHTML = ""; // Lista ürítése

  fetch(`https://iit-playground.arondev.hu/api/${neptun}/car`)
    .then(res => {
      if (!res.ok) {
        throw new Error("Nem sikerült lekérni az autókat. Ellenőrizd a Neptun-kódot!");
      }
      return res.json();
    })
    .then(cars => {
      if (!Array.isArray(cars) || cars.length === 0) {
        carList.innerHTML = "<li>Nincs megjeleníthető autó.</li>";
        return;
      }

      cars.forEach(car => {
        const li = document.createElement("li");
        li.textContent = `ID: ${car.id}, Típus: ${car.brand}, Modell: ${car.model}, Elektromos: ${car.electric ? "Igen" : "Nem"}, Fogyasztás: ${car.fuelUse}, Üzembe helyezés: ${car.dayOfCommission}, Tulajdonos: ${car.owner}`;
        // Ha van showCarDetails, akkor használható:
        li.onclick = () => getCarById(neptun, car.id);
        carList.appendChild(li);
      });
    })
    .catch(error => {
      carList.innerHTML = `<li style="color:red;">Hiba: ${error.message}</li>`;
    });
}
  
function getCarById(neptun, id) {

    if (!neptun || id < 0) {
      alert("Helytelen kitöltés!");
      return;
    }

    fetch(`https://iit-playground.arondev.hu/api/${neptun}/car/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Nem sikerült lekérni az autót.");
        }
        return response.json();
      })
      .then(car => {
        document.getElementById("carDetails").innerHTML = `
          <h3>Autó adatai</h3>
          <p><strong>ID:</strong> ${car.id}</p>
          <p><strong>Márka:</strong> ${car.brand}</p>
          <p><strong>Modell:</strong> ${car.model}</p>
          <p><strong>Elektromos:</strong> ${car.electric ? "Igen" : "Nem"}</p>
          <p><strong>Fogyasztás:</strong> ${car.fuelUse.toFixed(2)} l/100km</p>
          <p><strong>Forgalomba helyezés:</strong> ${car.dayOfCommission}</p>
          <p><strong>Tulajdonos:</strong> ${car.owner}</p>
        `;
      })
      .catch(error => {
        document.getElementById("carDetails").innerHTML = `<p style="color:red;">Hiba: ${error.message}</p>`;
      });
  }

  function createCar() {
    const neptun = document.getElementById("neptunInput").value.trim();
    const brand = document.getElementById("brandInput").value.trim();
    const model = document.getElementById("modelInput").value.trim();
    let tempfuelUse = parseFloat(document.getElementById("fueluseInput").value);
    const owner = document.getElementById("ownerInput").value.trim();
    const dayOfCommission = document.getElementById("dayOfCommissionInput").value;
    const electric = document.getElementById("electricInput").value === "true";

  if (!neptun || !brand || !model || isNaN(tempfuelUse) || !owner || !dayOfCommission) {
      alert("Minden mezőt ki kell tölteni!");
      return;
      }
  else if ( electric) {
      if (confirm("Elektromos lesz az autó, folytassuk?")) {
          tempfuelUse = 0;
      } else {
      return;
      }
      }
  else if ( 0 > tempfuelUse) {
          alert("Nem lehet negatív a fogyasztás!");
          return;
      }
  const fuelUse = tempfuelUse;

    const newCar = {
      brand,
      model,
      fuelUse,
      owner,
      dayOfCommission,
      electric
    };

    fetch(`https://iit-playground.arondev.hu/api/${neptun}/car`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCar)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Hiba történt az autó létrehozása közben.");
      }
      return response.json();
    })
    .then(data => {
      document.getElementById("carDetails").innerHTML = `
        <p style="color:green;">Az autó <strong>létrehozva</strong>, ID: ${data.id}</p>
      `;
    })
    .catch(error => {
      document.getElementById("carDetails").innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
  }

  function modCar() {
    const id = parseInt(document.getElementById("idInput").value.trim());
    const neptun = document.getElementById("neptunInput").value.trim();
    const brand = document.getElementById("brandInput").value.trim();
    const model = document.getElementById("modelInput").value.trim();
    let tempfuelUse = parseFloat(document.getElementById("fueluseInput").value);
    const owner = document.getElementById("ownerInput").value.trim();
    const dayOfCommission = document.getElementById("dayOfCommissionInput").value;
    const electric = document.getElementById("electricInput").value === "true";

  if (!neptun || !brand || !model || isNaN(tempfuelUse) || !owner || !dayOfCommission || 0 > id) {
      alert("Helytelen kitöltés!");
      return;
      }
  else if ( electric) {
      if (confirm("Elektromos lesz az autó, folytassuk?")) {
          tempfuelUse = 0;
      } else {
      return;
      }
      }
  else if ( 0 > tempfuelUse) {
          alert("Nem lehet negatív a fogyasztás!");
          return;
      }
  const fuelUse = tempfuelUse;

    const newCar = {
      id,
      brand,
      model,
      fuelUse,
      owner,
      dayOfCommission,
      electric
    };

    fetch(`https://iit-playground.arondev.hu/api/${neptun}/car`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCar)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Hiba történt az autó módosítása közben.");
      }
      return response.json();
    })
    .then(data => {
      document.getElementById("carDetails").innerHTML = `
        <p style="color:green;"> Az autó <strong>módosítva</strong>, ID: ${data.id}</p>
      `;
    })
    .catch(error => {
      document.getElementById("carDetails").innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
  }

  function showdelButton() {
    getCarById();
  document.getElementById("deleteBtn").style.display = "inline-block";
  }

  function delCar() {
    getCarById();
    const neptun = document.getElementById("neptunInput").value.trim();
    const id = parseInt(document.getElementById("idInput").value.trim());
    if (0 > id) {
        alert("Helytelen kitöltés!");
        return;
        }

    fetch(`https://iit-playground.arondev.hu/api/${neptun}/car/${id}`, {
      method: "DELETE",
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Hiba történt az autó törlése közben.");
      }
      return response.json();
    })
    .then(data => {
      document.getElementById("carDetails").innerHTML = `
        <p style="color:green;">Az autó <strong>törölve</strong> lett</p>
      `;
    })
    .catch(error => {
      document.getElementById("carDetails").innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
  }

loadNavigation();