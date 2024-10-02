import { createRouter, createWebHistory } from 'vue-router'
import SaleStockView from "@/views/SaleStockView.vue";
import LogInView from "@/views/LogInView.vue";
import RegisterView from "@/views/RegisterView.vue";
import AdminView from "@/views/AdminView.vue";
import BagView from "@/views/BagView.vue";
import ClientSearchView from "@/views/ClientSearchView.vue";
import ClientView from "@/views/ClientView.vue";
import InvoiceSearchView from "@/views/InvoiceSearchView.vue";
import InvoiceView from "@/views/InvoiceView.vue";
import EmployeeView from "@/views/EmployeeView.vue";

const routes = [
    {
        path: '/',
        name: 'Sale',
        component: SaleStockView,
    },
    {
        path: '/login',
        name: 'Login',
        component: LogInView,
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminView,
    },
    {
        path: '/bag',
        name: 'Bag',
        component: BagView,
    },
    {
        path: '/clientsearch',
        name: 'ClientSearch',
        component: ClientSearchView,
    },
    {
        path: '/client/:clientId',
        name: 'Client',
        component: ClientView,
        props: (route) => ({
            clientId: route.params.clientId,
        }),
    },
    {
        path: '/employee/:employeeId',
        name: 'Employee',
        component: EmployeeView,
        props: (route) => ({
            employeeId: route.params.employeeId,
        }),
    },
    {
        path: '/invoicesearch',
        name: 'InvoiceSearch',
        component: InvoiceSearchView,
    },
    {
        path: '/invoice/:invoiceId',
        name: 'Invoice',
        component: InvoiceView,
        props: (route) => ({
            invoiceId: route.params.invoiceId,
        }),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

