export default {
    home: () => '/',
    logout: () => '/logout',
    demo: () => '/demo',
    convertProgress: (videoId) => `/convert/${videoId ? videoId : ':videoId'}`,
    
    // Organization
    organizationUsers: () => '/organization/users',
    organizationVideos: () => '/organization/videos',
    organizationArticle: (articleId) => `/organization/article/${articleId ? articleId : ':articleId'}`,
    
    // Translation
    translationArticle: (articleId) => `/translation/article/${articleId ? articleId : ':articleId'}`,

}