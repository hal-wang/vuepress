module.exports = {
    title: 'VuePress 首页', // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
    description: 'VuePress 示例项目', // meta 中的描述文字，用于SEO
    head: [
        ['link', { rel: 'icon', href: '/h.png' }],  //浏览器的标签栏的网页图标
    ],
    markdown: {
        lineNumbers: true
    },
    base:'/vuepress_pages/',
    serviceWorker: true,
    themeConfig: {
        logo: '/h.png',
        lastUpdated: 'lastUpdate', // string | boolean
        nav: [
            { text: '首页', link: '/' },
            {
                text: '接口',
                ariaLabel: '接口',
                items: [
                    { text: '篮球技术统计接口说明', link: '/pages/statisApi/' },
                ]
            },
            {
                text: 'UWP',
                ariaLabel: 'UWP',
                items: [
                    { text: '窗口多开', link: '/pages/uwp/multiwindow' },
                    { text: '关联文件', link: '/pages/uwp/relevantFile' },
                    { text: 'Loaded和OnNavigatedTo执行顺序', link: '/pages/uwp/loadedAndOnNavigatedTo' },
                    { text: '重置UWP应用', link: '/pages/uwp/reset' },
                ]
            },
            { text: 'GitHub', link: 'https://github.com/hal-wang/vuepress' },
        ],
        sidebar: {
            '/pages/uwp/': [
                'multiwindow',
                'relevantFile',
                'loadedAndOnNavigatedTo',
                'reset'
            ],
            '/pages/statisApi/': [
                ''
            ],
            '/pages/start/': [
                ''
            ]
        }
    }
}