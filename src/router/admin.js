import store from '@/store/store.js' 

import admin            from '@/pages/admin/index.vue';
import defaultPage      from '@/views/admin/panels/default.vue';
import categoryPage     from '@/views/admin/panels/index.vue';
import families         from '@/views/admin/panels/families.vue';
 
const ifAuthenticated = (to, from, next) => {
    if (!store.getters.isAuthenticated) {
        return next('/login')
    } 
    next()
}

export default {
    path: '/admin',
    components: {
        default: admin
    },
    beforeEnter: ifAuthenticated,
    children: [
        {
            name: 'admin.index',
            path: '',
            components: {
                adminPageView: defaultPage
            }
        },
        {
            name: 'admin.category',
            path: 'categories',
            components: {
                adminPageView: categoryPage
            },
            children: [
                {
                    name: 'admin.category.families',
                    path: 'families',
                    components: {
                        categoryPageView: families
                    }
                },
                {
                    name: 'admin.category.subfamilies',
                    path: 'subfamilies',
                    components: {
                        categoryPageView: families
                    }
                }
            ]
        }
    ]
}