/* ==========================================
   CHURCH LYRICS LIBRARY
   INDEX.JS
========================================== */


/* ==========================================
   DEFAULT SONGS
========================================== */

const defaultSongs = [

    {
        id: 1,

        title: "Goodness of God",

        artist: "Bethel Music",

        category: "Worship",

        lyrics:
`Verse 1

I love You, Lord
Oh Your mercy never fails me
All my days, I've been held in Your hands

From the moment that I wake up
Until I lay my head
I will sing of the goodness of God


Chorus

All my life You have been faithful
All my life You have been so, so good
With every breath that I am able
I will sing of the goodness of God`
    },


    {
        id: 2,

        title: "10,000 Reasons",

        artist: "Matt Redman",

        category: "Praise",

        lyrics:
`Verse 1

Bless the Lord, O my soul
O my soul
Worship His holy name

Sing like never before
O my soul
I'll worship Your holy name


Chorus

You're rich in love
And You're slow to anger
Your name is great
And Your heart is kind`
    }

];


/* ==========================================
   LOAD SONGS
========================================== */

let songs = [];

try {

    const savedSongs =
        localStorage.getItem("churchSongs");

    if (savedSongs) {

        songs = JSON.parse(savedSongs);

    }

} catch (error) {

    console.log(
        "Unable to load saved songs."
    );

}


if (!Array.isArray(songs)) {

    songs = [];

}


/* ==========================================
   ADD DEFAULT SONGS IF EMPTY
========================================== */

if (songs.length === 0) {

    songs = defaultSongs;

    saveSongs();

}


/* ==========================================
   VARIABLES
========================================== */

let currentSongId = null;

let currentFontSize = 21;


/* ==========================================
   ELEMENTS
========================================== */

const songList =
    document.getElementById("songList");

const manageList =
    document.getElementById("manageList");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const songForm =
    document.getElementById("songForm");

const songId =
    document.getElementById("songId");

const songTitle =
    document.getElementById("songTitle");

const songArtist =
    document.getElementById("songArtist");

const songCategory =
    document.getElementById("songCategory");

const songLyrics =
    document.getElementById("songLyrics");

const formTitle =
    document.getElementById("formTitle");

const saveSongBtn =
    document.getElementById("saveSongBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const songCount =
    document.getElementById("songCount");

const noSongs =
    document.getElementById("noSongs");

const lyricsViewer =
    document.getElementById("lyricsViewer");

const lyricsTitle =
    document.getElementById("lyricsTitle");

const lyricsArtist =
    document.getElementById("lyricsArtist");

const lyricsCategory =
    document.getElementById("lyricsCategory");

const lyricsContent =
    document.getElementById("lyricsContent");

const viewerFavoriteBtn =
    document.getElementById(
        "viewerFavoriteBtn"
    );

const toast =
    document.getElementById("toast");

const navMenu =
    document.getElementById("navMenu");

const menuBtn =
    document.getElementById("menuBtn");


/* ==========================================
   SAVE SONGS
========================================== */

function saveSongs() {

    try {

        localStorage.setItem(
            "churchSongs",
            JSON.stringify(songs)
        );

    } catch (error) {

        console.log(
            "Unable to save songs.",
            error
        );

        showToast(
            "Unable to save songs."
        );

    }

}


/* ==========================================
   TOAST
========================================== */

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(
        function() {

            toast.classList.remove("show");

        },
        2000
    );

}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text || "";

    return div.innerHTML;

}


/* ==========================================
   DISPLAY SONGS
========================================== */

function displaySongs() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const category =
        categoryFilter.value;


    const filteredSongs =
        songs.filter(
            function(song) {

                const title =
                    String(
                        song.title || ""
                    ).toLowerCase();

                const artist =
                    String(
                        song.artist || ""
                    ).toLowerCase();


                const matchesSearch =
                    title.includes(search) ||
                    artist.includes(search);


                const matchesCategory =
                    category === "all" ||
                    song.category === category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    songList.innerHTML = "";


    if (filteredSongs.length === 0) {

        noSongs.style.display = "block";

        return;

    }


    noSongs.style.display = "none";


    filteredSongs.forEach(
        function(song) {

            const card =
                document.createElement("div");


            card.className =
                "song-card";


            const isFavorite =
                song.favorite === true;


            card.innerHTML = `

                <div class="song-icon">
                    🎵
                </div>

                <div class="song-info">

                    <h3>
                        ${escapeHTML(song.title)}
                    </h3>

                    <p>
                        ${escapeHTML(
                            song.artist ||
                            "Unknown Artist"
                        )}

                        •

                        ${escapeHTML(
                            song.category ||
                            "Other"
                        )}
                    </p>

                </div>

                <button
                    class="favorite-btn"
                    title="Favorite"
                >
                    ${isFavorite ? "★" : "☆"}
                </button>

            `;


            /* OPEN LYRICS */

            const songInfo =
                card.querySelector(
                    ".song-info"
                );


            songInfo.addEventListener(
                "click",
                function() {

                    openLyrics(song.id);

                }
            );


            /* FAVORITE */

            const favoriteButton =
                card.querySelector(
                    ".favorite-btn"
                );


            favoriteButton.addEventListener(
                "click",
                function(event) {

                    toggleFavorite(
                        event,
                        song.id
                    );

                }
            );


            songList.appendChild(card);

        }
    );

}


/* ==========================================
   SEARCH
========================================== */

searchInput.addEventListener(
    "input",
    displaySongs
);


categoryFilter.addEventListener(
    "change",
    displaySongs
);


/* ==========================================
   ADD / EDIT SONG
========================================== */

songForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const title =
            songTitle.value.trim();

        const artist =
            songArtist.value.trim();

        const category =
            songCategory.value;

        const lyrics =
            songLyrics.value.trim();


        if (
            !title ||
            !category ||
            !lyrics
        ) {

            showToast(
                "Please fill in all required fields."
            );

            return;

        }


        /* ==================================
           EDIT
        =================================== */

        if (songId.value) {

            const id =
                Number(songId.value);


            const song =
                songs.find(
                    function(item) {

                        return item.id === id;

                    }
                );


            if (song) {

                song.title =
                    title;

                song.artist =
                    artist;

                song.category =
                    category;

                song.lyrics =
                    lyrics;

            }


            showToast(
                "Song updated successfully!"
            );

        }


        /* ==================================
           ADD
        =================================== */

        else {

            const newSong = {

                id: Date.now(),

                title: title,

                artist: artist,

                category: category,

                lyrics: lyrics,

                favorite: false

            };


            songs.push(
                newSong
            );


            showToast(
                "Song added successfully!"
            );

        }


        /* SAVE */

        saveSongs();


        /* REFRESH */

        displaySongs();

        displayManageSongs();


        /* RESET */

        resetForm();


        /* GO TO SONGS */

        setTimeout(
            function() {

                document
                    .getElementById("songs")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            },
            300
        );

    }
);


/* ==========================================
   RESET FORM
========================================== */

function resetForm() {

    songForm.reset();

    songId.value = "";

    formTitle.textContent =
        "Add New Song";

    saveSongBtn.innerHTML =
        "➕ Save Song";

    cancelEditBtn.style.display =
        "none";

}


/* ==========================================
   CANCEL EDIT
========================================== */

cancelEditBtn.addEventListener(
    "click",
    resetForm
);


/* ==========================================
   EDIT SONG
========================================== */

function editSong(id) {

    const song =
        songs.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!song) {
        return;
    }


    songId.value =
        song.id;

    songTitle.value =
        song.title;

    songArtist.value =
        song.artist || "";

    songCategory.value =
        song.category;

    songLyrics.value =
        song.lyrics;


    formTitle.textContent =
        "Edit Song";

    saveSongBtn.innerHTML =
        "💾 Update Song";

    cancelEditBtn.style.display =
        "inline-block";


    document
        .getElementById("addSong")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ==========================================
   DELETE SONG
========================================== */

function deleteSong(id) {

    const song =
        songs.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!song) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${song.title}"?`
        );


    if (!confirmed) {
        return;
    }


    songs =
        songs.filter(
            function(item) {

                return item.id !== id;

            }
        );


    saveSongs();

    displaySongs();

    displayManageSongs();


    showToast(
        "Song deleted."
    );

}


/* ==========================================
   MANAGE SONGS
========================================== */

function displayManageSongs() {

    manageList.innerHTML = "";


    songCount.textContent =
        `${songs.length} ${
            songs.length === 1
                ? "song"
                : "songs"
        }`;


    if (songs.length === 0) {

        manageList.innerHTML = `

            <div class="no-songs">

                <div>
                    🎵
                </div>

                <h3>
                    No songs yet
                </h3>

                <p>
                    Add your first song above.
                </p>

            </div>

        `;

        return;

    }


    songs.forEach(
        function(song) {

            const card =
                document.createElement("div");


            card.className =
                "manage-card";


            card.innerHTML = `

                <div class="song-icon">
                    🎵
                </div>

                <div class="manage-info">

                    <h3>
                        ${escapeHTML(song.title)}
                    </h3>

                    <p>
                        ${escapeHTML(
                            song.artist ||
                            "Unknown Artist"
                        )}

                        •

                        ${escapeHTML(
                            song.category ||
                            "Other"
                        )}
                    </p>

                </div>

                <div class="manage-actions">

                    <button
                        class="edit-btn"
                        title="Edit"
                    >
                        ✏️
                    </button>

                    <button
                        class="delete-btn"
                        title="Delete"
                    >
                        🗑️
                    </button>

                </div>

            `;


            const editButton =
                card.querySelector(
                    ".edit-btn"
                );


            editButton.addEventListener(
                "click",
                function() {

                    editSong(song.id);

                }
            );


            const deleteButton =
                card.querySelector(
                    ".delete-btn"
                );


            deleteButton.addEventListener(
                "click",
                function() {

                    deleteSong(song.id);

                }
            );


            manageList.appendChild(card);

        }
    );

}


/* ==========================================
   OPEN LYRICS
========================================== */

function openLyrics(id) {

    const song =
        songs.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!song) {
        return;
    }


    currentSongId =
        id;


    /* SONG INFORMATION */

    lyricsTitle.textContent =
        song.title;

    lyricsArtist.textContent =
        song.artist ||
        "Unknown Artist";

    lyricsCategory.textContent =
        (
            song.category ||
            "Song"
        ).toUpperCase();


    /* ==================================
       IMPORTANT:
       SHOW ACTUAL LYRICS
    =================================== */

    lyricsContent.textContent =
        song.lyrics || "No lyrics available.";


    /* FONT */

    currentFontSize =
        21;

    lyricsContent.style.fontSize =
        currentFontSize + "px";


    /* FAVORITE */

    updateFavoriteViewer();


    /* SHOW VIEWER */

    lyricsViewer.classList.add(
        "active"
    );


    /* KEEP BODY SCROLLABLE */

    document.body.style.overflow =
        "hidden";


    /* SCROLL LYRICS VIEWER TO TOP */

    lyricsViewer.scrollTop =
        0;

}


/* ==========================================
   CLOSE LYRICS
========================================== */

document
    .getElementById("backBtn")
    .addEventListener(
        "click",
        closeLyrics
    );


function closeLyrics() {

    lyricsViewer.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";


    currentSongId =
        null;

}


/* ==========================================
   FAVORITE
========================================== */

function toggleFavorite(
    event,
    id
) {

    event.stopPropagation();


    const song =
        songs.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!song) {
        return;
    }


    song.favorite =
        !song.favorite;


    saveSongs();


    displaySongs();

    displayManageSongs();


    if (currentSongId === id) {

        updateFavoriteViewer();

    }

}


function updateFavoriteViewer() {

    const song =
        songs.find(
            function(item) {

                return item.id === currentSongId;

            }
        );


    if (!song) {
        return;
    }


    viewerFavoriteBtn.textContent =
        song.favorite
            ? "★"
            : "☆";

}


/* ==========================================
   VIEWER FAVORITE
========================================== */

viewerFavoriteBtn.addEventListener(
    "click",
    function() {

        if (!currentSongId) {
            return;
        }


        const song =
            songs.find(
                function(item) {

                    return item.id === currentSongId;

                }
            );


        if (!song) {
            return;
        }


        song.favorite =
            !song.favorite;


        saveSongs();


        updateFavoriteViewer();

        displaySongs();


        showToast(
            song.favorite
                ? "Added to favorites."
                : "Removed from favorites."
        );

    }
);


/* ==========================================
   INCREASE FONT
========================================== */

document
    .getElementById("increaseFont")
    .addEventListener(
        "click",
        function() {

            if (
                currentFontSize < 40
            ) {

                currentFontSize += 2;

                lyricsContent.style.fontSize =
                    currentFontSize + "px";

            }

        }
    );


/* ==========================================
   DECREASE FONT
========================================== */

document
    .getElementById("decreaseFont")
    .addEventListener(
        "click",
        function() {

            if (
                currentFontSize > 14
            ) {

                currentFontSize -= 2;

                lyricsContent.style.fontSize =
                    currentFontSize + "px";

            }

        }
    );


/* ==========================================
   COPY LYRICS
========================================== */

document
    .getElementById("copyLyricsBtn")
    .addEventListener(
        "click",
        async function() {

            const lyrics =
                lyricsContent.textContent;


            try {

                await navigator.clipboard.writeText(
                    lyrics
                );


                showToast(
                    "Lyrics copied!"
                );

            }

            catch (error) {

                /* FALLBACK */

                const textarea =
                    document.createElement(
                        "textarea"
                    );


                textarea.value =
                    lyrics;


                document.body.appendChild(
                    textarea
                );


                textarea.select();


                document.execCommand(
                    "copy"
                );


                textarea.remove();


                showToast(
                    "Lyrics copied!"
                );

            }

        }
    );


/* ==========================================
   LIGHT / DARK MODE
========================================== */

document
    .getElementById("lyricsDarkBtn")
    .addEventListener(
        "click",
        function() {

            lyricsViewer.classList.toggle(
                "light-lyrics"
            );


            const isLight =
                lyricsViewer.classList.contains(
                    "light-lyrics"
                );


            this.textContent =
                isLight
                    ? "🌙"
                    : "☀";

        }
    );


/* ==========================================
   MOBILE MENU
========================================== */

menuBtn.addEventListener(
    "click",
    function() {

        navMenu.classList.toggle(
            "active"
        );

    }
);


/* ==========================================
   CLOSE MOBILE MENU
========================================== */

document
    .querySelectorAll(
        "#navMenu a"
    )
    .forEach(
        function(link) {

            link.addEventListener(
                "click",
                function() {

                    navMenu.classList.remove(
                        "active"
                    );

                }
            );

        }
    );


/* ==========================================
   INITIAL LOAD
========================================== */

displaySongs();

displayManageSongs();
