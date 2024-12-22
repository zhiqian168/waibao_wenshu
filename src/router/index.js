import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import ResetPassword from '@/components/ResetPassword.vue'
import DashboardView from '@/components/Dashboard.vue'
import DocumentManagement from '@/components/DocumentManagement.vue'
import DataUpload from '@/components/DataUpload.vue'
import DataPreprocessing from '@/components/DataPreprocessing.vue'
import FactFinding from '@/components/FactFinding.vue'
import CaseGrouping from '@/components/CaseGrouping.vue'
import DocumentGeneration from '@/components/DocumentGeneration.vue'
import CaseManagement from '@/components/CaseManagement.vue'
import HelpCenter from '@/components/HelpCenter.vue'
import UserSettings from '@/components/UserSettings.vue'
import CaseForm from '@/components/CaseForm.vue'
import VideoDetail from '@/components/VideoDetail.vue'


const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterForm
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/document-management',
    name: 'DocumentManagement',
    component: DocumentManagement
  },
  {
    path: '/data-upload',
    name: 'DataUpload',
    component: DataUpload
  },
  {
    path: '/data-preprocessing',
    name: 'DataPreprocessing',
    component: DataPreprocessing
  },
  {
    path: '/fact-finding',
    name: 'FactFinding',
    component: FactFinding
  },
  {
    path: '/case-grouping',
    name: 'CaseGrouping',
    component: CaseGrouping
  },
  {
    path: '/document-generation',
    name: 'DocumentGeneration',
    component: DocumentGeneration
  },
  {
    path: '/case-management',
    name: 'CaseManagement',
    component: CaseManagement
  },
  {
    path: '/help-center',
    name: 'HelpCenter',
    component: HelpCenter
  },
  {
    path: '/user-settings',
    name: 'UserSettings',
    component: UserSettings
  },

  {
    path: '/case/new',
    name: 'CreateCase',
    component: CaseForm
  },
  {
    path: '/case/:id/edit',
    name: 'EditCase',
    component: CaseForm
  },
  {
    path: '/help-center/video/:id',
    name: 'VideoDetail',
    component: VideoDetail,
    props: true
  }


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router