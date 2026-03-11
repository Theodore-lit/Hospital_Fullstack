import AdminDashobardView from '@/views/admin/AdminDashobardView.vue'
import AdminStatistique from '@/views/admin/AdminStatistique.vue'
import DetailsView from '@/views/DetailsView.vue'
import DoctorDashboardView from '@/views/doctors/DoctorDashboardView.vue'
import DoctorsStatistique from '@/views/doctors/DoctorsStatistique.vue'
import DoctorsView from '@/views/DoctorsView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ReceptionnistDashboardView from '@/views/receptionnist/ReceptionnistDashboardView.vue'
import ReceptStatistique from '@/views/receptionnist/ReceptStatistique.vue'
import ReceptionnistsView from '@/views/ReceptionnistsView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import MyPatientsView from '@/views/doctors/MyPatientsView.vue'
import MyAppointementsView from '@/views/doctors/MyAppointementsView.vue'
import InfosUsersView from '@/views/InfosUsersView.vue'
import RoomView from '@/views/receptionnist/RoomView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import PageUnauthoriziedView from '@/views/PageUnauthoriziedView.vue'
import ReceptionnistAppointView from '@/views/receptionnist/ReceptionnistAppointView.vue'
import DetailsUsers from '@/views/admin/DetailsUsers.vue'
import PatientsView from '@/views/PatientsView.vue'

const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: PageUnauthoriziedView,
  },
  {
    path: '/',
    redirect: { name: 'login' },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/info-user',
    name: 'info-user',
    component: InfosUsersView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboardadmin',
    name: 'admin',
    component: AdminDashobardView,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
    children: [
      {
        path: 'dashboard-admin',
        name: 'dashboard-admin',
        component: AdminStatistique,
      },
      {
        path: 'patients',
        name: 'patients-admin',
        component: PatientsView,
      },
      {
        path: 'doctors',
        name: 'doctors-admin',
        component: DoctorsView,
      },
      {
        path: 'receptionnists',
        name: 'receptionnists-admin',
        component: ReceptionnistsView,
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfileView,
      },
      {
        path: 'appointments',
        name: 'appointments-admin',
        component: ReceptionnistAppointView,
      },
      {
        path: 'details',
        name: 'details',
        component: DetailsView,
      },
      {
        path: 'rooms',
        name: 'rooms-admin',
        component: RoomView,
      },
      {
        path: 'details',
        name: 'details-admin',
        component: DetailsUsers,
      },
    ],
  },
  {
    path: '/dashboarddoctor',
    name: 'doctor',
    component: DoctorDashboardView,
    meta: {
      requiresAuth: true,
      role: 'doctor',
    },
    children: [
      {
        path: 'dashboard-doctor',
        name: 'dashboard-doctor',
        component: DoctorsStatistique,
      },
      {
        path: 'mypatients',
        name: 'mypatients',
        component: MyPatientsView,
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfileView,
      },
      {
        path: 'myappointements',
        name: 'myappointements',
        component: MyAppointementsView,
      },
    ],
  },
  {
    path: '/dashboardreceptionnist',
    name: 'receptionnist',
    component: ReceptionnistDashboardView,
    meta: {
      requiresAuth: true,
      role: 'receptionnist',
    },
    children: [
      {
        path: 'dashboard-receptionnist',
        name: 'dashboard-receptionnist',
        component: ReceptStatistique,
      },
      {
        path: 'patients',
        name: 'patients-reception',
        component: PatientsView,
      },
      {
        path: 'rooms',
        name: 'rooms-reception',
        component: RoomView,
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfileView,
      },

      {
        path: 'appointments',
        name: 'all-appointments',
        component: ReceptionnistAppointView,
      },
      {
        path: 'details',
        name: 'details',
        component: DetailsView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const loginStore = useLoginStore()
  const logged = loginStore.isAuthentificated
  const userRole = loginStore.currentUser.data?.role

  if (to.meta.requiresAuth && !logged) {
    next({ name: 'login' })
  } else if (to.name === 'login' && logged) {
    if (userRole === 'admin') {
      next({ name: 'dashboard-admin' })
    }
    if (userRole === 'doctor') {
      next({ name: 'dashboard-doctor' })
    }
    if (userRole === 'receptionnist') {
      next({ name: 'dashboard-receptionnist' })
    }
  } 
  if (to.meta.role && to.meta.role !== userRole) {
    return next({ name: 'unauthorized' })
  }
 else {
   next()
 }
})
export default router
