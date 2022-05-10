import Layout from '@/layout'

const financeRouter = {
  path: '/finance',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Finance',
  meta: {
    title: '财务中心',
    icon: 'finance'
  },
  children: [
    {
      path: 'financeIndex',
      component: () => import('@/views/financeCenter/index'),
      name: 'FinanceIndex',
      meta: { title: '充值记录', noCache: true }
    },
    {
      path: 'current-company-account',
      component: () => import('@/views/financeCenter/currentCompanyAccount'),
      name: 'CurrentCompanyAccount',
      meta: { title: '当前公司账户', noCache: true }
    },
    {
      path: 'rebate-bill',
      component: () => import('@/views/financeCenter/rebateBill'),
      name: 'RebateBill',
      meta: { title: '返利账单', noCache: true }
    },
    {
      path: 'billing-list',
      component: () => import('@/views/financeCenter/billingList'),
      name: 'BillingList',
      meta: { title: '开票清单', noCache: true }
    },
    {
      path: 'invoicing-application',
      component: () => import('@/views/financeCenter/invoicingApplication'),
      name: 'InvoicingApplication',
      meta: { title: '开票申请', noCache: true }
    },
    {
      path: 'application-record',
      component: () => import('@/views/financeCenter/applicationRecord'),
      name: 'ApplicationRecord',
      meta: { title: '申请记录', noCache: true }
    }
  ]
}

export default financeRouter
