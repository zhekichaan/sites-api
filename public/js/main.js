let page = 1,
  searchName = null;
const perPage = 6;

const loadSitesData = () => {
  const url = `/api/sites?page=${page}&perPage=${perPage}${
    searchName ? `&name=${searchName}` : ""
  }`;

  fetch(url)
    .then((res) => {
      return res.ok ? res.json() : Promise.reject(res.status);
    })
    .then((data) => {
      if (data.length) {
        let sitesRows = `
        ${data
          .map(
            (site) =>
              `<tr data-id=${site._id}>
                        <td>${site.siteName}</td>
                        <td><img class="img-thumbnail" src="${site.image}"></td>
                        <td>${site.description}</td>
                        <td><ul>${site.dates.map((date) => {
                          return `<li>${date.year} ${date.type}</li>`;
                        })}</ul></td>
                        <td>${site.designated}</td>
                        <td>${site.location.latitude} | ${
                site.location.longitude
              }</td>
                        <td>${site.location.town}</td>
                        <td>${site.provinceOrTerritory.name}</td>
                        <td>${site.provinceOrTerritory.region}</td>
                    </tr>`
          )
          .join("")}
        `;

        document.querySelector("#sitesTable tbody").innerHTML = sitesRows;
        document.querySelector("#current-page").textContent = page;

        document.querySelectorAll("#sitesTable tbody tr").forEach((row) => {
          row.addEventListener("click", (e) => {
            let clickedId = row.getAttribute("data-id");
            fetch(`api/sites/${clickedId}`)
              .then((res) => res.json())
              .then((site) => {
                document.querySelector(
                  "#detailsModal .modal-body"
                ).innerHTML = `
                  <img id="photo" 
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Photo+Not+Available'" 
                    class="img-fluid w-100 mb-3"
                    src="${site.image}" 
                  />

                  <p><strong>Description:</strong> ${site.description}</p>

                  <p><strong>Dates:</strong></p>
                  <ul>
                    ${site.dates
                      .map((date) => `<li>${date.year} ${date.type}</li>`)
                      .join("")}
                  </ul>

                  <p><strong>Designated:</strong> ${site.designated}</p>
                  <p><strong>Location:</strong> ${site.location.latitude}, ${
                  site.location.longitude
                }</p>
                  <p><strong>Town:</strong> ${site.location.town}</p>
                  <p><strong>Province/Territory:</strong> ${
                    site.provinceOrTerritory.name
                  }</p>
                  <p><strong>Region:</strong> ${
                    site.provinceOrTerritory.region
                  }</p>
                `;

                let modal = new bootstrap.Modal(
                  document.getElementById("detailsModal"),
                  {
                    backdrop: "static",
                    keyboard: false,
                  }
                );

                modal.show();
              });
          });
        });
      } else {
        if (page > 1) {
          page--;
        } else {
          document.querySelector(
            "#sitesTable tbody"
          ).innerHTML = `<tr><td colspan="4"><strong>No data available</td></tr>`;
        }
      }
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};

// Execute when the DOM is 'ready'
document.addEventListener("DOMContentLoaded", function () {
  loadSitesData();

  document.querySelector("#previous-page").addEventListener("click", () => {
    if (page > 1) {
      page--;
      loadSitesData();
    }
  });

  document.querySelector("#next-page").addEventListener("click", () => {
    page++;
    loadSitesData();
  });

  document.querySelector("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();

    searchName = document.querySelector("#name").value;

    page = 1;
    loadSitesData();
  });

  document.querySelector("#clearForm").addEventListener("click", (e) => {
    document.querySelector("#name").value = "";

    searchName = null;
    loadSitesData();
  });
});
