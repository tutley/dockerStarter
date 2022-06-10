// general state items to be used on the app level
// things like error messages and alerts

const state = {
    errorMessage: '',
    showEmailValidation: false,
}

const actions = {
    setErrorMessage({ commit }, payload) {
        commit('setErrorMessage', payload)
    },
    clearErrorMessage({ commit }) {
        commit('clearErrorMessage')
    },
    setShowEmailValidation({ commit}, payload) {
        commit('setShowEmailValidation', payload)
    }
}

const mutations = {
    setErrorMessage(state, payload) {
        state.errorMessage = payload
    },
    clearErrorMessage(state) {
        state.errorMessage = ''
    },
    setShowEmailValidation(state, payload) {
        state.showEmailValidation = payload
    }
}

const getters = {
    errorMessage(state) {
        return state.errorMessage
    },
    isErrorMessage(state) {
        if (state.errorMessage === '') {
            return false
        }
        return true
    },
    showEmailValidation(state) {
        return state.showEmailValidation
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}