import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

import router from '@/router'
import { resolveMenu, resolveRoute } from '@/router/helper'
import { routeRecordRaw } from '@/router/record'

import { pinia } from '.'

import type { MenuMixedOptions } from '@/router/helper'
import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'

interface User {
  avatar?: string
  id?: string
  name?: string
  role?: 'admin' | 'user'
  description?: string
}

const DEFAULT_USER: User = {
  avatar: '',
  description: '机场安全监控',
  id: '2000',
  name: 'admin',
  role: 'admin',
}

export const useUserStore = defineStore('userStore', () => {
  const user = useStorage<User>('user', DEFAULT_USER)

  const token = useStorage<string | null>('token', null)

  const menuList = ref<MenuOption[]>([])

  const routeList = ref<RouteRecordRaw[]>([])

  async function resolveMenuList() {
    const res = await new Promise<MenuMixedOptions[]>((resolve) => {
      if (token.value?.includes('admin')) {
        resolve(routeRecordRaw)
      } else {
        const allowedRoutes = ['dashboard', 'dataShow', 'notfoundPage', 'about']
        const filteredRoutes = routeRecordRaw.filter((route) => {
          return !route.type && route.name && allowedRoutes.includes(route.name as string)
        })
        resolve(filteredRoutes)
      }
    })

    menuList.value = resolveMenu(res) || []
    routeList.value = resolveRoute(res) || []
  }

  function cleanup(redirectPath?: string) {
    router.replace({
      name: 'signIn',
      ...(redirectPath ? { query: { r: redirectPath } } : {}),
    })

    token.value = null
    user.value = null

    if (router.hasRoute('layout')) {
      router.removeRoute('layout')
    }

    menuList.value = []

    routeList.value = []
  }

  return {
    user,
    token,
    menuList,
    routeList,
    resolveMenuList,
    cleanup,
  }
})

export function toRefsUserStore() {
  return {
    ...storeToRefs(useUserStore(pinia)),
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
