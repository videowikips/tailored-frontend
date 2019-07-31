export const IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'svg', 'tif', 'tiff', 'webp', 'jif', 'jfif', 'jp2', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd'];
export const VIDEOS_EXTESION = ['webm', 'mp4', 'ogg', 'ogv'];
export const GIF_EXTESIONS = ['gif'];
export const VIDEO_PLAYER_THUMBNAIL_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/6/63/Video_play_icon.png';
export const SPEAKER_BACKGROUND_COLORS = {
    0: '#800080',
    1: 'blue',
    2: 'green',
    3: 'yellow',
    4: 'orange',
    5: '#4c4c4c',
    6: '#9a0000',
    7: 'purple',
    8: '#038284',
    9: '#3e3e71',
    10: '#6435c9',
}


export const WEBSOCKET_SERVER_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'http://52.30.216.243:4000';
