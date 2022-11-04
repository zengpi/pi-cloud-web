import router from '@/router';
import NProgress from 'nprogress';
import '@/assets/styles/nprogress.scss';

import useStore from '@/stores';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const { useUserStore, useRouterStore } = useStore();

    if (useUserStore.token) {
        if (to.path === '/login') {
            next({ path: '/' });
        } else {
            if (useUserStore.username !== '') {
                if (to.matched.length === 0) {
                    from.name ? next({ name: from.name }) : next('/401');
                } else {
                    next();
                }
            } else {
                await useUserStore.getUserInfo().then(async () => {
                    const accessRoutes: any = await useRouterStore.generateRouters();
                    accessRoutes.forEach((route: any) => {
                        router.addRoute(route);
                    });
                    next({ ...to, replace: true });
                }).catch((err) => {
                    console.error(err)
                    useUserStore.reset()
                    next(`/login?redirect=${to.path}`);
                })
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next(`/login?redirect=${to.path}`);
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});
