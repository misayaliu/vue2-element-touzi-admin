
export const topRouterMap = [
    {
        'parentName':'EAP',
        'data':[

            {
                path: 'signList',
                name: 'signList',
                meta: {
                    title: '认领列表',
                    icon: 'fa-asterisk',
                    routerType: 'topmenu'
                },
                component: () => import('@/page/infoManage/orderList.vue')
            }

        ]
    }
]


