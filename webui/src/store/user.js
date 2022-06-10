// profile: the user's profile
// isLoggedIn: a flag to use around the UI to set views appropriately

const state = {
    profile: null,
    accessToken: null,
    refreshToken: null
}

const actions = {
    setProfile({ commit }, payload) {
        commit('setProfile', payload)
    },
    setAccessToken({ commit }, payload) {
        commit('setAccessToken', payload)
    },
    setRefreshToken({ commit }, payload) {
        commit('setRefreshToken', payload)
    }
}

const mutations = {
    setProfile(state, payload) {
        state.profile = payload
    },
    setAccessToken(state, payload) {
        state.accessToken = payload
    },
    setRefreshToken(state, payload) {
        state.refreshToken = payload
    }
}

const getters = {
    profile(state) {
        return state.profile
    },
    isLoggedIn(state) {
        if (state.accessToken && state.refreshToken) {
            return true
        }
        return false
    },
    accessToken(state) {
        return state.accessToken
    },
    refreshToken(state) {
        return state.refreshToken
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}