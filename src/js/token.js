import Cookies from 'js-cookie'
import storage from '@/utils/storage.js'


const tokenKey = 'auth_token'

export function getToken() {

    return storage.getItem(tokenKey)
    // return Cookies.get(TokenKey)
}

export function setToken(token) {

    storage.setItem(tokenKey, token)
    // return Cookies.set(tokenKey, token, {expires: 30})
}

export function removeToken() {

    storage.removeItem(tokenKey)
    // return Cookies.remove(tokenKey)
}
