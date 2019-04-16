import Vue from 'vue'
import Router from 'vue-router'

import live from '@/views/live'
import openlive from '@/views/openlive'
import room from '@/views/room'
import member from '@/views/member'
import user from '@/views/user'
import banlist from '@/views/banlist'
import barrage from '@/views/barrage'
import setting from '@/views/setting'
import account from '@/views/account'
import readme from '@/views/readme'


Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/live',
      name: 'live',
      component: live
    },

    {
      path: '/openlive',
      name: 'openlive',
      component: openlive
    },

    {
      path: '/room',
      name: 'room',
      component: room
    },
    {
      path: '/member',
      name: 'member',
      component: member
    },
    {
      path: '/user',
      name: 'user',
      component: user
    },
    {
      path: '/banlist',
      name: 'banlist',
      component: banlist
    }, {
      path: '/barrage',
      name: 'barrage',
      component: barrage
    },
    {
      path: '/setting',
      name: 'setting',
      component: setting
    },
    {
      path: '/account',
      name: 'account',
      component: account
    },
    {
      path: '/readme',
      name: 'readme',
      component: readme,
      alias: '/'
    },
  ]
})
