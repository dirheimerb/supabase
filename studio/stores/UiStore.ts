import { uuidv4 } from 'lib/helpers'
import { action, makeAutoObservable } from 'mobx'
import { Project, Notification, User, Organization } from 'types'
import { IRootStore } from './RootStore'
import Telemetry from 'lib/telemetry'

export interface IUiStore {
  language: 'en_US'
  theme: 'dark' | 'light'
  themeOption: 'dark' | 'light' | 'system'

  selectedProjectRef?: string
  isDarkTheme: boolean
  selectedProject?: Project
  selectedOrganization?: Organization
  notification?: Notification
  profile?: User

  load: () => void
  setTheme: (theme: 'dark' | 'light') => void
  onThemeOptionChange: (themeOption: 'dark' | 'light' | 'system') => void
  setProjectRef: (ref?: string) => void
  setOrganizationSlug: (slug?: string) => void
  setNotification: (notification: Notification) => string
  setProfile: (value?: User) => void
}
export default class UiStore implements IUiStore {
  rootStore: IRootStore
  language: 'en_US' = 'en_US'
  theme: 'dark' | 'light' = 'dark'
  themeOption: 'dark' | 'light' | 'system' = 'dark'

  selectedProjectRef?: string
  selectedOrganizationSlug?: string
  notification?: Notification
  profile?: User

  constructor(rootStore: IRootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {
      setProjectRef: action,
      setOrganizationSlug: action,
    })
  }

  get selectedProject() {
    if (this.selectedProjectRef) {
      const found = this.rootStore.app.projects.find(
        (x: Project) => x.ref == this.selectedProjectRef
      )
      return found
    }
    return undefined
  }

  get selectedOrganization() {
    if (this.selectedOrganizationSlug) {
      const found = this.rootStore.app.organizations.find(
        (x: Organization) => x.slug == this.selectedOrganizationSlug
      )
      return found
    }
    if (this.selectedProjectRef) {
      const organizationId = this.selectedProject?.organization_id
      const found = this.rootStore.app.organizations.find(
        (x: Organization) => x.id == organizationId
      )
      return found
    }
    return undefined
  }

  get isDarkTheme() {
    return this.theme === 'dark'
  }

  load() {
    if (typeof window === 'undefined') return
    const localStorageThemeOption = window.localStorage.getItem('theme')
    if (localStorageThemeOption === 'system') {
      this.themeOption = localStorageThemeOption
      return this.setTheme(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      )
    }
    if (localStorageThemeOption === 'light') {
      this.themeOption = localStorageThemeOption
      return this.setTheme('light')
    }
    window.localStorage.setItem('theme', 'dark')
    this.themeOption = 'dark'
    this.setTheme('dark')
  }

  setTheme(theme: 'dark' | 'light') {
    this.theme = theme
    document.body.className = theme
  }

  onThemeOptionChange(themeOption: 'dark' | 'light' | 'system') {
    this.themeOption = themeOption
    if (themeOption === 'system') {
      window.localStorage.setItem('theme', 'system')
      return this.setTheme(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      )
    }
    window.localStorage.setItem('theme', themeOption)
    this.setTheme(themeOption)
  }

  setProjectRef(ref?: string) {
    this.selectedProjectRef = ref
  }

  setOrganizationSlug(slug?: string) {
    this.selectedOrganizationSlug = slug
  }

  setNotification(notification: Notification): string {
    const id = notification?.id ?? uuidv4()
    this.notification = { ...notification, id }
    return id
  }

  setProfile(value?: User) {
    if (value && value?.id !== this.profile?.id) {
      Telemetry.sendIdentify(value)
    }

    this.profile = value
  }
}
