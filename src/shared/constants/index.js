export const IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'svg', 'tif', 'tiff', 'webp', 'jif', 'jfif', 'jp2', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd'];
export const VIDEOS_EXTESION = ['webm', 'mp4', 'ogg', 'ogv'];
export const GIF_EXTESIONS = ['gif'];
export const VIDEO_PLAYER_THUMBNAIL_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/6/63/Video_play_icon.png';
export const SPEAKER_BACKGROUND_COLORS = {
    [-1]: 'white',
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


export const WEBSOCKET_SERVER_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'http://Fargate-tvw-backend-loadbalancer-426334897.eu-west-1.elb.amazonaws.com';
export const API_ROOT = process.env.API_ROOT ? process.env.API_ROOT : (process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : 'http://Fargate-tvw-backend-loadbalancer-426334897.eu-west-1.elb.amazonaws.com/api');
