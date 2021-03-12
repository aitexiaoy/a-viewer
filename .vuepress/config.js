module.exports = {
    title: 'SVGA、Lottie动画在线预览',
    description: 'SVGA、Lottie动画在线预览',
    dest: "docs",
    base:'/a-viewer/',
    head: [
        ['script', { src: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js' }],
        ['script', { src: 'https://cdn.jsdelivr.net/npm/svgaplayerweb@2.3.1/build/svga.min.js' }],
        ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.7.6/lottie.min.js' }],

    ],
    themeConfig: {
        search: false,
        title: false,
    },
    plugins: {
      
    }
}