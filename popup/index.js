function changePopup() {
    if (popup == "forms") {
        table.hidden = false;
        forms.hidden = true;
        popup = "table";
        
        browser.runtime.sendMessage({type: "retrieve_data"})
        .then(function(response) {
            if (response) {
                items = response;
                populate(items);
            } else {
                console.log("No response");
            }
        });
    } else {
        forms.hidden = false;
        table.hidden = true;
        document.getElementById("table_body").innerHTML = "";
        popup = "forms"
    }
}

function exportCSV() {
    browser.runtime.sendMessage({type: "exportCSV"});
}

function fillName() {
    browser.runtime.sendMessage({type: "retrieve_name"})
        .then(function(response) {
            if (response != "empty") {
                document.getElementById("item").value = response;
            }
        });
}

function fillURL() {
    browser.tabs.query({active: true, currentWindow: true})
        .then(function(tab) {
            document.getElementById("website").value = tab[0].url;
        });
}

function populate() {
    let table = document.getElementById("table_body");
    let row;
    for (let i = 0, j = items.length; i < j; i++) {
        row = table.insertRow();
        row.name = i;
        row.onclick = function() {
            navigator.clipboard.writeText(items[this.name][4])
                .then(function() {
                    document.getElementById("alert2").textContent = "URL copied to clipboard";
                    document.getElementById("alert2").hidden = false;
                })
        };
        for (let j = 0, m = items[i].length - 1; j < m; j++) {
            row.insertCell(j).innerHTML = items[i][j];
        }
    }
}

function saveItem() {
    let item_data = [
        document.getElementById("item").value,
        document.getElementById("store").value,
        document.getElementById("price").value,
        document.getElementById("remarks").value,
        document.getElementById("website").value
    ]

    browser.runtime.sendMessage({type: "add_data", content: item_data})
        .then(function(response) {
            document.getElementById("alert").textContent = response;
            document.getElementById("alert").hidden = false;
        })

}


const forms = document.getElementById("forms_content")
const table = document.getElementById("table")
let popup = "forms";
let items;

fillName();
fillURL()

document.getElementById("add_entry").addEventListener("click", changePopup);
document.getElementById("export").addEventListener("click", exportCSV);
document.getElementById("save").addEventListener("click", saveItem);
document.getElementById("show-all").addEventListener("click", changePopup);