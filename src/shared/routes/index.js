export default {
    home: () => '/',
    logout: () => '/logout',
    demo: () => '/demo',
    convertProgress: (videoId = ':videoId') => `/convert/${videoId}`,
    
    // Organization
    organizationUsers: () => '/organization/users',
    organizationVideos: () => '/organization/videos',
    organizationHome: () => '/organization',
    organizationArticle: (articleId = ':articleId') => `/organization/article/${articleId}`,
    
    // Translation
    translationArticle: (articleId = ':articleId') => `/translation/article/${articleId}`,

}