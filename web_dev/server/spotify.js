const client_secret = '6f8451b4a61d490e8a47f2675356630c'
const client_id = 'b57026daf84447f58283d9c643f91401'

var token_type
var access_token

async function getSongListBasedOnScene() {
    try {
        const response = await fetch('https://api.spotify.com/v1/recommendations?limit=20&target_popularity=0.9', {
            method: 'GET',
            headers: {
                "Authorization": `${token_type} ${access_token}`
            },
        });
        const text = await response.text(); // Read response as text
        console.log('Raw response:', text); // Log the raw response

        // Only parse JSON if the response is valid
        try {
            const data = JSON.parse(text);
            return data;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            throw new Error('Invalid JSON response');
        }
        /* const result = await response.json();
        console.log('spotify call successful:', result);
        console.log(response.tracks) */
    } catch (error) {
        console.error('spotify call:', error);
    }

    return [
        { title: "Song 1", artist: "Artist 1", url: "https://example.com/song1" },
        { title: "Song 2", artist: "Artist 2", url: "https://example.com/song2" },
        { title: "Song 3", artist: "Artist 3", url: "https://example.com/song3" },
    ];
}

async function getCredentials() {
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: client_id,
                client_secret: client_secret
            })
        });
        const result = await response.json();
        token_type = result.token_type
        access_token = result.access_token
        console.log(response)
        console.log(token_type)
        console.log(access_token)
    } catch (error) {
        console.error('credentials failed:', error);
    }


}
module.exports = { getSongListBasedOnScene, getCredentials };
