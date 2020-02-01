var notes = ['B', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b', 'C'];
var keybind = ['S', 'D', 'R', 'F', 'T', 'G', 'H', 'U', 'J', 'I', 'K', 'O', 'L', 'º'];
var accidentals = ["", "", " sharp", " flat"];



$(function () {
    setup();
    $('input[type="radio"]').change(function () {
        var checked = $('input[type="radio"]:checked').attr("id");

        if (checked == "showkeys") {
            $("html").addClass("keybind");
        } else {
            $("html").removeClass("keybind");
        }
    });


    $(document).keydown(function (e) {
        var pressed = String.fromCharCode(e.which);

        if (keybind.indexOf(pressed) !== -1) {
            var index = keybind.indexOf(pressed);
            $('.key[data-note="' + notes[index] + '"]').mousedown();
            setTimeout(function () {
                $(".key").removeClass("active").unbind("mouseover");
            }, 200);
        }
    });

    
   
     var note_element = $(".note_sheet.treble .note").children("span");
     var note_accidental = note_element.find("span");
    function getNote() {
        var note = "";
        var created = false;
        var random_key = Math.round(Math.random() * 6);
        var onlyNote = notes[random_key];
        var onlyOct = 5;
        var onlyAcc = onlyNote.includes('#') ? 'sharp': 'flat';
        if (onlyNote == notes[6] && onlyOct == 5) {
            onlyOct = onlyOct - 1;
        }

        var note = onlyNote + onlyOct + onlyAcc;
        if (!created) {
            note_element.addClass('note-' + onlyNote + onlyOct);
            note_accidental.addClass(onlyAcc);
        }
        return [note];
    }

    function removeNote(guessedNote) {
            if (guessedNote[1] == 3) {
                note_element.removeClass('note-' + guessedNote[0] + guessedNote[1] + "-treble");
                note_accidental.removeClass(guessedNote.slice(3));
            } else {
                note_element.removeClass('note-' + guessedNote[0] + guessedNote[1]);
                note_accidental.removeClass(guessedNote.slice(3));
            }
    
    }

    function ambigNote(taskNote) {
        return taskNote;
    }

    function popAnswer(answer) {
        $('#wrong-answer').addClass("hidden");
        $('#right-answer').addClass("hidden");
        if (answer == "correct") {
            setTimeout(function () {
            $('#right-answer').removeClass("hidden");
            }, 200);
        } else {
           setTimeout(function () {
                $('#wrong-answer').removeClass("hidden");
            }, 200);
        }
    }


    var noteInfo = getNote();
    var note = ambigNote(noteInfo[0]);

    function checkAnswerAndGenerateNewNode(note, clickedNote, octave){
        var noteClicked = clickedNote + octave;
        if (noteClicked == note) {
            popAnswer("correct");
        } else {
            popAnswer("wrong");
        }
        
    }
    // Clicks
    $(".key").mousedown(function () {
        var $this = $(this);
        var clickedNote = $(this).attr("data-note");
        var octave = $(this).attr("data-octave");
        play($this, clickedNote, octave);
        checkAnswerAndGenerateNewNode(note, clickedNote, octave);
        removeNote(note);
        noteInfo = getNote();
        note = noteInfo[0];

        $(".key").mouseover(function () {
            var $this = $(this);
            var clickedNote = $(this).attr("data-note");
            var octave = $(this).attr("data-octave");

            play($this, clickedNote, octave);
            checkAnswerAndGenerateNewNode(note, clickedNote, octave);
    
        });

        $(document).mouseup(function () {
            $(".key").unbind("mouseover");
        });
    });

});

function setup() {
    $.each(notes, function (i, note) {
        var octave = 5;

        if (note === "B") {
            var octave = octave - 1;
        }
        if (note === "C") {
            var octave = octave + 1;
        }

        var $key = $('<button class="key" data-bind="' + keybind[i] + '" data-note=' + note + ' data-octave=' + octave + '></button>');

        $(".keyboard").append($key);
    });
}


function play($this, note, octave) {
    console.log(note + octave);
    $this.addClass("active");
    var play = beeplay().play(note + octave, 3 / 4);
}
