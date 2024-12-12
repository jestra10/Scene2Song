import requests
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# Spotify API setup
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id="d8ad8767ca5f407ea144b292f697ef29",
    client_secret="ae17fe0a0ce6433ebf0eb3bf4bd55062"
))

# Genius API setup
GENIUS_API_KEY = "EKZfRwU-UnhIP6u1pcYOxE4GENUD3tb28CTIv5Y1JmIxbpe7ll6MKWTpuEA3N4xX"
GENIUS_SEARCH_URL = "https://api.genius.com/search"

def search_lyrics_on_genius(theme):
    """
    Search for songs on Genius with lyrics that match the given theme.
    """
    headers = {"Authorization": f"Bearer {GENIUS_API_KEY}"}
    params = {"q": theme}  # Search by theme
    response = requests.get(GENIUS_SEARCH_URL, headers=headers, params=params)

    if response.status_code == 200:
        data = response.json()
        hits = data.get("response", {}).get("hits", [])
        songs = [
            {
                "title": hit["result"]["title"],
                "artist": hit["result"]["primary_artist"]["name"]
            }
            for hit in hits
        ]
        return songs
    else:
        print(f"Genius API Error: {response.status_code}")
        return []

def find_songs_on_spotify(songs):
    """
    Search Spotify for songs based on the title and artist.
    """
    spotify_songs = []
    for song in songs:
        query = f"{song['title']} {song['artist']}"
        results = sp.search(q=query, type="track", limit=1)
        if results["tracks"]["items"]:
            track = results["tracks"]["items"][0]
            spotify_songs.append({
                "title": track["name"],
                "artist": track["artists"][0]["name"],
                "spotify_url": track["external_urls"]["spotify"]
            })
    return spotify_songs

def search_theme_in_lyrics_and_spotify(theme):
    """
    Combine Genius and Spotify APIs to find songs matching a theme in their lyrics.
    """
    print(f"Searching for songs with the theme: {theme}")
    
    # Search lyrics on Genius
    
    songs_with_lyrics = search_lyrics_on_genius(theme)
    if not songs_with_lyrics:
        print("No songs found on Genius for this theme.")
        return
    
    print(f"Found {len(songs_with_lyrics)} songs on Genius. Searching on Spotify...")
    
    # Find matching songs on Spotify
    spotify_songs = find_songs_on_spotify(songs_with_lyrics)
    if spotify_songs:
        print("\n--- Songs Found on Spotify ---")
        for song in spotify_songs:
            print(f"{song['title']} by {song['artist']} - {song['spotify_url']}")
    else:
        print("No matching songs found on Spotify.")
    print("Spotify songs")
    print(spotify_songs)
    return spotify_songs
