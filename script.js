document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause');
    const currentSongImg = document.getElementById('current-song-img');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentSongArtist = document.getElementById('current-song-artist');
    const progressBar = document.querySelector('.progress');
    const currentTimeEl = document.querySelector('.time.current');
    const totalTimeEl = document.querySelector('.time.total');
    const volumeLevel = document.querySelector('.volume-level');
    const likeButton = document.getElementById('likeButton');
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const searchIcon = document.getElementById('searchIcon');
    const searchBar = document.getElementById('searchBar');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const playlistGrid = document.getElementById('playlistGrid');
    const recentlyPlayed = document.getElementById('recentlyPlayed');
    const searchResults = document.getElementById('searchResults');
    const libraryItems = document.getElementById('libraryItems');
    const createPlaylistBtn = document.getElementById('createPlaylist');
    const likedSongsBtn = document.getElementById('likedSongs');
    const customPlaylists = document.getElementById('customPlaylists');
    const playlistModal = document.getElementById('playlistModal');
    const closeModal = document.querySelector('.close');
    const savePlaylistBtn = document.getElementById('savePlaylist');
    const playlistNameInput = document.getElementById('playlistName');
    const shuffleButton = document.getElementById('shuffleButton');
    const reloadButton = document.getElementById('reloadButton');
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.header').prepend(menuButton);

    // Sample music data
    const musicLibrary = [
        {
            id: 1,
            title: "Non-Stop (Guitar Version)",
            artist: "Drake",
            cover: "covers/Lee.jpg",
            file: "music/NonStop.mp3",
            duration: "4:00"
        },
        {
            id: 2,
            title: "Mortal",
            artist: "Warriyo",
            cover: "covers/brotherhood.jpg",
            file: "music/Mortal.mp3",
            duration: "3:50"
        },
        {
            id: 3,
            title: "Keygen Funk",
            artist: "Prey",
            cover: "covers/ronaldo.jpg",
            file: "music/Keygen Funk.mp3",
            duration: "1:39"
        },
        {
            id: 4,
            title: "SimpsonWave 1995",
            artist: "FrankJavCee",
            cover: "covers/trio.jpg",
            file: "music/SimpsonWave1995.mp3",
            duration: "1:50"
        },
        {
            id: 5,
            title: "Joyfull - Chess",
            artist: "The Good Vibe",
            cover: "covers/rat_dance.png",
            file: "music/chess.mp3",
            duration: "2:22"
        },
        {
            id: 6,
            title: "Save Your Tears",
            artist: "The Weeknd",
            cover: "covers/weekend.jpg",
            file: "music/Save Your Tears.mp3",
            duration: "3:36"
        },
        {
            id: 7,
            title: "Crystal Skies",
            artist: "VXLLAIN",
            cover: "covers/BladeRunner.jpg",
            file: "music/Crystal Skies.mp3",
            duration: "2:56"
        },
        {
            id: 8,
            title: "The Grid - Tron Legacy",
            artist: "Draft Punk",
            cover: "covers/tron.jpg",
            file: "music/The Grid.mp3",
            duration: "1:37"
        },
        {
            id: 9,
            title: "Music Sound Better With You",
            artist: "Star Dust",
            cover: "covers/gta.jpg",
            file: "music/Music Sounds Better With You.mp3",
            duration: "1:57"
        },
        {
            id: 10,
            title: "Walking on a Dream",
            artist: "Empire of the Sun",
            cover: "covers/Ippo.jpg",
            file: "music/Walking on a dream.mp3",
            duration: "0:45"
        },
        {
            id: 11,
            title: "The Amazing Spider Man 2 (Theme)",
            artist: "Hans Zimmer",
            cover: "covers/spiderman.jpg",
            file: "music/spiderman.mp3",
            duration: "0:30"
        },
        {
            id: 12,
            title: "Dead End",
            artist: "DudePlaya",
            cover: "covers/silver surfer.jpg",
            file: "music/DeadEnd.mp3",
            duration: "0:30"
        }
    ];

    // App state
    let currentSongIndex = 0;
    let isPlaying = false;
    let likedSongs = [];
    let playlists = [];
    let currentPlaylist = null;
    let isLiked = false;

    // Initialize the app
    function init() {
        loadData();
        renderPlaylists();
        renderRecentlyPlayed();
        renderLibrary();
        setupEventListeners();
    }

    // Load data from localStorage
    function loadData() {
        const savedLikedSongs = localStorage.getItem('likedSongs');
        if (savedLikedSongs) {
            likedSongs = JSON.parse(savedLikedSongs);
        }

        const savedPlaylists = localStorage.getItem('playlists');
        if (savedPlaylists) {
            playlists = JSON.parse(savedPlaylists);
            renderCustomPlaylists();
        }
    }

    // Save data to localStorage
    function saveData() {
        localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
        localStorage.setItem('playlists', JSON.stringify(playlists));
    }

    // Render playlist items
    function renderPlaylists() {
        playlistGrid.innerHTML = '';
        
        // Group by artist
        const artists = [...new Set(musicLibrary.map(song => song.artist))];
        
        artists.forEach(artist => {
            const artistSongs = musicLibrary.filter(song => song.artist === artist);
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.innerHTML = `
                <img src="${artistSongs[0].cover}" alt="${artist}">
                <h3>${artist}</h3>
                <p>Artist • ${artistSongs.length} songs</p>
            `;
            playlistItem.addEventListener('click', () => playArtist(artist));
            playlistGrid.appendChild(playlistItem);
        });
    }

    // Render recently played items
    function renderRecentlyPlayed() {
        recentlyPlayed.innerHTML = '';
        
        // Show last 6 played songs
        const recentlyPlayedSongs = [...musicLibrary].reverse().slice(0, 6);
        
        recentlyPlayedSongs.forEach(song => {
            const recentItem = document.createElement('div');
            recentItem.className = 'recent-item';
            recentItem.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="recent-item-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
            `;
            recentItem.addEventListener('click', () => playSong(song));
            recentlyPlayed.appendChild(recentItem);
        });
    }

    // Render library items
    function renderLibrary() {
        libraryItems.innerHTML = '';
        
        // Liked songs
        const likedSongsItem = document.createElement('div');
        likedSongsItem.className = 'library-item';
        likedSongsItem.innerHTML = `
            <img src="covers/liked-songs.jpg" alt="Liked Songs">
            <div class="library-item-info">
                <h3>Liked Songs</h3>
                <p>Playlist • ${likedSongs.length} songs</p>
            </div>
        `;
        likedSongsItem.addEventListener('click', () => {
            currentPlaylist = { id: 'liked', name: 'Liked Songs', songs: likedSongs };
            renderPlaylistSongs(currentPlaylist);
            switchContentSection('library');
        });
        libraryItems.appendChild(likedSongsItem);
        
        // Custom playlists
        playlists.forEach(playlist => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'library-item';
            playlistItem.innerHTML = `
                <img src="covers/playlist.jpg" alt="${playlist.name}">
                <div class="library-item-info">
                    <h3>${playlist.name}</h3>
                    <p>Playlist • ${playlist.songs.length} songs</p>
                </div>
            `;
            playlistItem.addEventListener('click', () => {
                currentPlaylist = playlist;
                renderPlaylistSongs(playlist);
                switchContentSection('library');
            });
            libraryItems.appendChild(playlistItem);
        });
    }

    // Render songs in a playlist
    function renderPlaylistSongs(playlist) {
        libraryItems.innerHTML = `
            <div class="playlist-header">
                <h2>${playlist.name}</h2>
                <p>${playlist.songs.length} songs</p>
            </div>
        `;
        
        playlist.songs.forEach(songId => {
            const song = musicLibrary.find(s => s.id === songId);
            if (song) {
                const songItem = document.createElement('div');
                songItem.className = 'library-item';
                songItem.innerHTML = `
                    <img src="${song.cover}" alt="${song.title}">
                    <div class="library-item-info">
                        <h3>${song.title}</h3>
                        <p>${song.artist}</p>
                    </div>
                `;
                songItem.addEventListener('click', () => playSong(song));
                libraryItems.appendChild(songItem);
            }
        });
    }

    // Render custom playlists in sidebar
    function renderCustomPlaylists() {
        customPlaylists.innerHTML = '';
        
        playlists.forEach(playlist => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'custom-playlist-item';
            playlistItem.innerHTML = `
                <i class="fas fa-list"></i>
                <span>${playlist.name}</span>
            `;
            playlistItem.addEventListener('click', () => {
                currentPlaylist = playlist;
                renderPlaylistSongs(playlist);
                switchContentSection('library');
            });
            customPlaylists.appendChild(playlistItem);
        });
    }

    // Filter songs based on search term
    function filterSongs(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        return musicLibrary.filter(song => 
            song.title.toLowerCase().includes(searchTerm) || 
            song.artist.toLowerCase().includes(searchTerm)
        );
    }

    // Render search results
    function renderSearchResults(songs) {
        searchResults.innerHTML = '';
        
        if (songs.length === 0) {
            searchResults.innerHTML = '<p>No results found</p>';
            return;
        }
        
        songs.forEach(song => {
            const songElement = document.createElement('div');
            songElement.className = 'recent-item';
            songElement.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="recent-item-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
            `;
            songElement.addEventListener('click', () => playSong(song));
            searchResults.appendChild(songElement);
        });
    }

    // Play artist's songs
    function playArtist(artist) {
        const artistSongs = musicLibrary.filter(song => song.artist === artist);
        if (artistSongs.length > 0) {
            playSong(artistSongs[0]);
        }
    }

    // Play a song
    function playSong(song) {
        const songIndex = musicLibrary.findIndex(s => s.id === song.id);
        if (songIndex !== -1) {
            currentSongIndex = songIndex;
            const songToPlay = musicLibrary[currentSongIndex];
            
            audioPlayer.src = songToPlay.file;
            currentSongImg.src = songToPlay.cover;
            currentSongTitle.textContent = songToPlay.title;
            currentSongArtist.textContent = songToPlay.artist;
            totalTimeEl.textContent = songToPlay.duration;
            
            // Update like button state
            isLiked = likedSongs.includes(songToPlay.id);
            likeButton.classList.toggle('liked', isLiked);
            likeButton.classList.toggle('far', !isLiked);
            likeButton.classList.toggle('fas', isLiked);
            
            playAudio();
        }
    }

    // Play audio
    function playAudio() {
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    // Pause audio
    function pauseAudio() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }

    // Toggle like button
    function toggleLike() {
        const currentSong = musicLibrary[currentSongIndex];
        if (!currentSong) return;
        
        isLiked = !isLiked;
        
        if (isLiked) {
            if (!likedSongs.includes(currentSong.id)) {
                likedSongs.push(currentSong.id);
            }
        } else {
            likedSongs = likedSongs.filter(id => id !== currentSong.id);
        }
        
        likeButton.classList.toggle('liked', isLiked);
        likeButton.classList.toggle('far', !isLiked);
        likeButton.classList.toggle('fas', isLiked);
        
        saveData();
    }

    // Create new playlist
    function createPlaylist() {
        playlistModal.style.display = 'block';
    }

    // Save new playlist
    function savePlaylist() {
        const name = playlistNameInput.value.trim();
        if (name) {
            const newPlaylist = {
                id: Date.now(),
                name: name,
                songs: []
            };
            
            playlists.push(newPlaylist);
            saveData();
            renderCustomPlaylists();
            renderLibrary();
            
            playlistNameInput.value = '';
            playlistModal.style.display = 'none';
        }
    }

    // Update progress bar
    function updateProgress() {
        const { duration, currentTime } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Update current time
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }

    // Set progress when clicked on progress bar
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }

    // Set volume when clicked on volume bar
    function setVolume(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const volume = clickX / width;
        audioPlayer.volume = volume;
        volumeLevel.style.width = `${volume * 100}%`;
    }

    // Play next song
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex >= musicLibrary.length) {
            currentSongIndex = 0;
        }
        playSong(musicLibrary[currentSongIndex]);
    }

    // Play previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = musicLibrary.length - 1;
        }
        playSong(musicLibrary[currentSongIndex]);
    }

    // Shuffle functionality
    function shuffleSongs() {
        // Clone and shuffle the music library
        const shuffled = [...musicLibrary].sort(() => 0.5 - Math.random());
        currentSongIndex = musicLibrary.findIndex(song => song.id === shuffled[0].id);
        playSong(musicLibrary[currentSongIndex]);
    }

    // Reload current song
    function reloadSong() {
        if (musicLibrary[currentSongIndex]) {
            playSong(musicLibrary[currentSongIndex]);
        }
    }

    // Switch content section
    function switchContentSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionId}-content`).classList.add('active');
    }

    // Toggle sidebar on mobile
    function toggleSidebar() {
        document.querySelector('.sidebar').classList.toggle('active');
    }

    // Setup event listeners
    function setupEventListeners() {
        // Player controls
        playPauseBtn.addEventListener('click', togglePlayPause);
        likeButton.addEventListener('click', toggleLike);
        
        // Progress and volume
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', nextSong);
        document.querySelector('.progress-bar').addEventListener('click', setProgress);
        document.querySelector('.volume-bar').addEventListener('click', setVolume);
        
        // Navigation buttons
        document.querySelector('.fa-step-forward').parentElement.addEventListener('click', nextSong);
        document.querySelector('.fa-step-backward').parentElement.addEventListener('click', prevSong);
        
        // Shuffle and reload buttons
        shuffleButton.addEventListener('click', shuffleSongs);
        reloadButton.addEventListener('click', reloadSong);
        
        // Logo reload
        document.querySelector('.logo').addEventListener('click', function() {
            location.reload();
        });
        
        // Nav items
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                switchContentSection(this.dataset.target);
            });
        });
        
        // Search functionality
        searchIcon.addEventListener('click', function() {
            searchBar.classList.add('active');
            searchInput.focus();
            this.style.display = 'none';
        });
        
        closeSearch.addEventListener('click', function() {
            searchBar.classList.remove('active');
            searchIcon.style.display = 'block';
            searchInput.value = '';
            searchResults.innerHTML = '';
        });
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value;
            if (searchTerm.length > 0) {
                const filteredSongs = filterSongs(searchTerm);
                renderSearchResults(filteredSongs);
            } else {
                searchResults.innerHTML = '';
            }
        });
        
        // Playlist functionality
        createPlaylistBtn.addEventListener('click', createPlaylist);
        likedSongsBtn.addEventListener('click', function() {
            currentPlaylist = { id: 'liked', name: 'Liked Songs', songs: likedSongs };
            renderPlaylistSongs(currentPlaylist);
            switchContentSection('library');
        });
        
        // Modal functionality
        closeModal.addEventListener('click', function() {
            playlistModal.style.display = 'none';
        });
        
        savePlaylistBtn.addEventListener('click', savePlaylist);
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === playlistModal) {
                playlistModal.style.display = 'none';
            }
        });
        
        // Mobile menu
        menuButton.addEventListener('click', toggleSidebar);
    }

    // Initialize the app
    init();
});