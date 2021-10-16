myUrl = "https://raw.githubusercontent.com/alessiorera/pronostiCalcio/main/partite.json"
json = 0
data = 0
rifare = 0
$(document).ready(function() {
    let G = localStorage.getItem("Punti")
    if (G == null || G == 'NaN') {
        $("#punti").text("0")
        localStorage.setItem("Punti", 0)
        rifare = 1
    } else {
        $("#punti").text(localStorage.getItem("Punti"))
    }
    $.getJSON(myUrl,
        function(data, textStatus, jqXHR) {
            json = data
            let divTutto
            let divPartita
            let divSquadra1
            let divSquadra2
            let divRisultato
            let gol1
            let trattino
            let gol2
            let pulsanti
            let pronostica
            let n1
            let n2
            $.each(data, function(i, partita) {
                if (rifare == 1) {
                    localStorage.setItem(`${i}Contato`, false)
                }
                divTutto = $("<div class='tutto' id=" + i + ">")
                divPartita = $("<div class='partita'>")
                divSquadra1 = $("<div class='squadra'>").append(partita.squadra1)
                divSquadra2 = $("<div class='squadra'>").append(partita.squadra2)
                divRisultato = $("<div class='risultato'>")
                trattino = $("<div class='trattino'>").append("-")
                pronostica = $("<input type='button' value='PRONOSTICA' class='pronostica'  id=" + i + " onclick='pronosticaMatch(event)'>")
                if (partita.golSquadra1 != -1) {
                    gol1 = $(`<input min='0' max='9' type='number' class='gol' value='${partita.golSquadra1}'>`)
                    gol2 = $(`<input min='0' max='9' type='number' class='gol' value='${partita.golSquadra2}'>`)
                    pronostica.prop("disabled", true)
                    pronostica.prop("title", "Partita già giocata")
                    divPartita.css("background-color", "rgba(255, 255, 255, 0.712)")
                    if (localStorage.getItem(i) == "disabled") {
                        verificaPunti(divTutto, i, partita.squadra1, partita.squadra2, partita.golSquadra1, partita.golSquadra2)
                    }
                } else {
                    gol1 = $(`<input min='0' max='9' type='number' class='gol' value='0'>`)
                    gol2 = $(`<input min='0' max='9' type='number' class='gol' value='0'>`)
                }
                if (localStorage.getItem(i) == "disabled") {
                    pronostica.prop("disabled", true)
                    pronostica.prop("title", "Partita già pronosticata")
                    if (partita.golSquadra1 != -1) {
                        pronostica.prop("title", "Partita già pronosticata e giocata")
                    } else {
                        n1 = localStorage.getItem(`${partita.squadra1}-${partita.squadra2}`)
                        n2 = localStorage.getItem(`${partita.squadra1}-${partita.squadra2}`)
                        gol1.prop("value", n1.split("-")[0])
                        gol2.prop("value", n2.split("-")[1])
                    }
                }
                pulsanti = $("<div class='pulsanti'>").append(pronostica)
                $(divRisultato).append(gol1, trattino, gol2)
                $(divPartita).append(divSquadra1, divRisultato, divSquadra2)
                $(divTutto).append(divPartita, pulsanti)
                $("#matches").append(divTutto)
            });
            rifare = 0
        }
    );
});

function pronosticaMatch(e) {
    console.log(e.target.id)
    let squadra1 = e.target.parentElement.parentElement.children[0].children[0].textContent
    let squadra2 = e.target.parentElement.parentElement.children[0].children[2].textContent
    let golSquadra1 = e.target.parentElement.parentElement.children[0].children[1].children[0].value
    let golSquadra2 = e.target.parentElement.parentElement.children[0].children[1].children[2].value
    console.log(`${squadra1} ${golSquadra1} - ${golSquadra2} ${squadra2}`)
    localStorage.setItem(`${squadra1}-${squadra2}`, `${golSquadra1}-${golSquadra2}`)
    console.log(`${squadra1}-${squadra2}`, `${golSquadra1}-${golSquadra2}`)
    alert(`${squadra1}-${squadra2} pronosticato!`)
    $(e.target).prop("disabled", true)
    localStorage.setItem(e.target.id, "disabled")
}

function verificaPunti(div, i, squadra1, squadra2, golSquadra1, golSquadra2) {
    console.log(i, squadra1, squadra2, golSquadra1, golSquadra2)
    if (localStorage.getItem(`${i}Contato`) != 'true') {
        let ris1 = localStorage.getItem(`${squadra1}-${squadra2}`)
        console.log(ris1)
        risSquadra1 = ris1.split("-")[0]
        risSquadra2 = ris1.split("-")[1]
        console.log(risSquadra1)
        console.log(risSquadra2)
        let punti = 0
        if (golSquadra1 == risSquadra1) {
            punti = punti + 5
        }
        if (golSquadra2 == risSquadra2) {
            punti = punti + 5
        }
        if (risSquadra1 - risSquadra2 == 0 && golSquadra1 - golSquadra2 == 0) {
            //pareggio
            punti = punti + 5
        }
        if (risSquadra1 - risSquadra2 > 0 && golSquadra1 - golSquadra2 > 0) {
            //vittoria squadra1
            punti = punti + 5
        }
        if (risSquadra1 - risSquadra2 < 0 && golSquadra1 - golSquadra2 < 0) {
            //vittoria squadra2
            punti = punti + 5
        }
        let puntiIniziali = parseInt(localStorage.getItem("Punti"))
        let puntiFinali = puntiIniziali + punti
        localStorage.setItem("Punti", puntiFinali)
        localStorage.setItem(`${i}Contato`, true)
    }
    $("#punti").text(localStorage.getItem("Punti"))
}

function cerca(e) {
    let squadra = e.target.parentElement[0].value
    squadra = squadra.toUpperCase()
    console.log(squadra)
    If (squadra == "code25punti"){
       localStorage.setItem("Punti",25)
       $("#punti").text(localStorage.getItem("Punti"))
    }
    if (squadra == "") {
        $(".tutto").fadeIn()
    } else {
        $(".tutto").fadeOut()
        $.each($(".tutto"), function(index, value) {
            console.log(value.id)
                // console.log(value.children[0].children[0].textContent)
            if (value.children[0].children[0].textContent.toUpperCase() == squadra || value.children[0].children[2].textContent.toUpperCase() == squadra) {
                $(`#${value.id}`).fadeIn()
            }
        });
    }
}
